#!/bin/bash

# Екипен Platform - Automated Backup Script
# This script creates automated backups and uploads them to AWS S3

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/ekipen_backup_$BACKUP_DATE"
LOCAL_BACKUP_RETENTION_DAYS=3
S3_BACKUP_RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[BACKUP]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    log_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
}

# Backup MySQL database
backup_database() {
    log_info "Backing up MySQL database..."
    
    # Create database dump
    docker-compose exec -T mysql mysqldump \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --add-drop-database \
        --add-drop-table \
        --create-options \
        --extended-insert \
        --quick \
        --lock-tables=false \
        -u root -p"$DB_ROOT_PASSWORD" \
        "$DB_DATABASE" > "$BACKUP_DIR/database.sql"
    
    if [ $? -eq 0 ]; then
        log_success "Database backup completed"
        
        # Compress database backup
        gzip "$BACKUP_DIR/database.sql"
        log_success "Database backup compressed"
    else
        log_error "Database backup failed"
        return 1
    fi
}

# Backup Laravel storage files
backup_storage() {
    log_info "Backing up Laravel storage files..."
    
    # Create storage backup
    docker-compose exec -T backend tar -czf - -C /var/www/html storage > "$BACKUP_DIR/storage.tar.gz"
    
    if [ $? -eq 0 ]; then
        log_success "Storage backup completed"
    else
        log_error "Storage backup failed"
        return 1
    fi
}

# Backup Docker volumes
backup_volumes() {
    log_info "Backing up Docker volumes..."
    
    # Get list of volumes
    VOLUMES=$(docker volume ls --format "table {{.Name}}" | grep "ekipen")
    
    for volume in $VOLUMES; do
        log_info "Backing up volume: $volume"
        
        docker run --rm \
            -v "$volume":/volume \
            -v "$BACKUP_DIR":/backup \
            alpine tar -czf "/backup/volume_${volume}.tar.gz" -C /volume .
        
        if [ $? -eq 0 ]; then
            log_success "Volume $volume backed up"
        else
            log_warning "Failed to backup volume $volume"
        fi
    done
}

# Backup application configuration
backup_config() {
    log_info "Backing up application configuration..."
    
    # Backup environment files
    cp .env.production "$BACKUP_DIR/" 2>/dev/null || log_warning ".env.production not found"
    cp docker-compose.production.yml "$BACKUP_DIR/" 2>/dev/null || log_warning "docker-compose.production.yml not found"
    
    # Backup nginx configuration
    if [ -d "docker/nginx" ]; then
        tar -czf "$BACKUP_DIR/nginx_config.tar.gz" docker/nginx/
        log_success "Nginx configuration backed up"
    fi
    
    # Backup SSL certificates
    if [ -d "docker/nginx/ssl" ]; then
        tar -czf "$BACKUP_DIR/ssl_certs.tar.gz" docker/nginx/ssl/
        log_success "SSL certificates backed up"
    fi
}

# Create backup metadata
create_metadata() {
    log_info "Creating backup metadata..."
    
    cat > "$BACKUP_DIR/metadata.json" << EOF
{
    "backup_date": "$BACKUP_DATE",
    "backup_type": "full",
    "application": "Екипен Platform",
    "version": "$(git describe --tags --always 2>/dev/null || echo 'unknown')",
    "environment": "production",
    "hostname": "$(hostname)",
    "docker_compose_version": "$(docker-compose version --short)",
    "database_version": "$(docker-compose exec -T mysql mysql --version | head -1)",
    "backup_size": "$(du -sh $BACKUP_DIR | cut -f1)",
    "files": [
        "database.sql.gz",
        "storage.tar.gz",
        "nginx_config.tar.gz",
        "ssl_certs.tar.gz",
        ".env.production",
        "docker-compose.production.yml"
    ]
}
EOF
    
    log_success "Backup metadata created"
}

# Upload to S3
upload_to_s3() {
    if [ -z "$S3_BUCKET" ]; then
        log_warning "S3_BUCKET not configured, skipping S3 upload"
        return 0
    fi
    
    log_info "Uploading backup to S3..."
    
    # Create compressed archive
    ARCHIVE_NAME="ekipen_backup_$BACKUP_DATE.tar.gz"
    tar -czf "/tmp/$ARCHIVE_NAME" -C "$(dirname $BACKUP_DIR)" "$(basename $BACKUP_DIR)"
    
    # Upload to S3
    aws s3 cp "/tmp/$ARCHIVE_NAME" "s3://$S3_BUCKET/backups/$ARCHIVE_NAME" \
        --storage-class STANDARD_IA \
        --metadata "backup-date=$BACKUP_DATE,application=ekipen,environment=production"
    
    if [ $? -eq 0 ]; then
        log_success "Backup uploaded to S3: s3://$S3_BUCKET/backups/$ARCHIVE_NAME"
        
        # Clean up local archive
        rm "/tmp/$ARCHIVE_NAME"
    else
        log_error "S3 upload failed"
        return 1
    fi
    
    # Clean up old S3 backups
    cleanup_s3_backups
}

# Clean up old S3 backups
cleanup_s3_backups() {
    log_info "Cleaning up old S3 backups (older than $S3_BACKUP_RETENTION_DAYS days)..."
    
    CUTOFF_DATE=$(date -d "$S3_BACKUP_RETENTION_DAYS days ago" +%Y-%m-%d)
    
    aws s3api list-objects-v2 \
        --bucket "$S3_BUCKET" \
        --prefix "backups/ekipen_backup_" \
        --query "Contents[?LastModified<'$CUTOFF_DATE'].Key" \
        --output text | while read -r key; do
        
        if [ -n "$key" ]; then
            aws s3 rm "s3://$S3_BUCKET/$key"
            log_info "Deleted old backup: $key"
        fi
    done
}

# Verify backup integrity
verify_backup() {
    log_info "Verifying backup integrity..."
    
    # Check if all files exist
    local files=("database.sql.gz" "storage.tar.gz" "metadata.json")
    
    for file in "${files[@]}"; do
        if [ -f "$BACKUP_DIR/$file" ]; then
            log_success "✓ $file exists"
        else
            log_error "✗ $file missing"
            return 1
        fi
    done
    
    # Test database backup integrity
    log_info "Testing database backup integrity..."
    gunzip -t "$BACKUP_DIR/database.sql.gz"
    if [ $? -eq 0 ]; then
        log_success "Database backup integrity verified"
    else
        log_error "Database backup is corrupted"
        return 1
    fi
    
    # Test storage backup integrity
    log_info "Testing storage backup integrity..."
    tar -tzf "$BACKUP_DIR/storage.tar.gz" > /dev/null
    if [ $? -eq 0 ]; then
        log_success "Storage backup integrity verified"
    else
        log_error "Storage backup is corrupted"
        return 1
    fi
}

# Clean up local backups
cleanup_local_backups() {
    log_info "Cleaning up local backups (older than $LOCAL_BACKUP_RETENTION_DAYS days)..."
    
    find /tmp -name "ekipen_backup_*" -type d -mtime +$LOCAL_BACKUP_RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
    
    log_success "Local backup cleanup completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"text\":\"💾 Екипен Platform Backup $status: $message\"}" \
             "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
             --data "{\"content\":\"💾 Екипен Platform Backup $status: $message\"}" \
             "$DISCORD_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
}

# Main backup function
main() {
    log_info "Starting Екипен Platform backup process..."
    
    # Check if required environment variables are set
    if [ -z "$DB_ROOT_PASSWORD" ] || [ -z "$DB_DATABASE" ]; then
        log_error "Required environment variables not set"
        exit 1
    fi
    
    # Execute backup steps
    create_backup_dir
    backup_database
    backup_storage
    backup_volumes
    backup_config
    create_metadata
    verify_backup
    upload_to_s3
    cleanup_local_backups
    
    # Calculate backup size
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    
    log_success "🎉 Backup completed successfully!"
    log_info "Backup location: $BACKUP_DIR"
    log_info "Backup size: $BACKUP_SIZE"
    
    send_notification "SUCCESS" "Backup completed successfully. Size: $BACKUP_SIZE"
    
    # Remove backup directory if S3 upload was successful
    if [ -n "$S3_BUCKET" ]; then
        rm -rf "$BACKUP_DIR"
        log_info "Local backup directory cleaned up"
    fi
}

# Error handling
trap 'log_error "Backup failed at line $LINENO"; send_notification "FAILED" "Backup failed at line $LINENO"; exit 1' ERR

# Run main function
main "$@"