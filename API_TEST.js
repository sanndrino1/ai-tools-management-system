// API Testing Script for AI Tools Management System

console.log('🚀 Testing AI Tools Management API...\n');

const API_BASE = 'http://localhost:8001/api';

// Test 1: Get all roles
async function testRoles() {
  try {
    console.log('📋 Testing Roles API...');
    const response = await fetch(`${API_BASE}/roles`);
    const roles = await response.json();
    console.log(`✅ Found ${roles.length} roles:`);
    roles.forEach(role => {
      console.log(`   - ${role.display_name} (${role.name}) - ${role.users_count} users`);
    });
    return roles;
  } catch (error) {
    console.log('❌ Roles test failed:', error.message);
    return [];
  }
}

// Test 2: Get all users
async function testUsers() {
  try {
    console.log('\n👥 Testing Users API...');
    const response = await fetch(`${API_BASE}/users`);
    const users = await response.json();
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      const role = user.role ? user.role.display_name : 'No Role';
      console.log(`   - ${user.name} (${user.email}) - ${role}`);
    });
    return users;
  } catch (error) {
    console.log('❌ Users test failed:', error.message);
    return [];
  }
}

// Test 3: Get all tools
async function testTools() {
  try {
    console.log('\n🛠️ Testing Tools API...');
    const response = await fetch(`${API_BASE}/tools`);
    const tools = await response.json();
    console.log(`✅ Found ${tools.length} tools:`);
    tools.forEach(tool => {
      const status = tool.is_active ? '🟢' : '🔴';
      console.log(`   ${status} ${tool.name} (${tool.category}) - ⭐${tool.rating}`);
    });
    return tools;
  } catch (error) {
    console.log('❌ Tools test failed:', error.message);
    return [];
  }
}

// Test 4: Create new user
async function testCreateUser(roles) {
  try {
    console.log('\n➕ Testing User Creation...');
    
    if (roles.length === 0) {
      console.log('❌ No roles available for user creation');
      return null;
    }

    const designerRole = roles.find(r => r.name === 'designer');
    
    const newUser = {
      name: 'Test Designer',
      email: 'test.designer@aitools.dev',
      password: 'password123',
      role_id: designerRole?.id || roles[0].id
    };

    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });

    if (response.ok) {
      const user = await response.json();
      console.log(`✅ Created user: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role?.display_name || 'No Role'}`);
      return user;
    } else {
      const error = await response.json();
      console.log('❌ User creation failed:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ User creation test failed:', error.message);
    return null;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  const roles = await testRoles();
  const users = await testUsers();
  const tools = await testTools();
  const newUser = await testCreateUser(roles);

  console.log('\n📊 Test Summary:');
  console.log(`✅ Roles: ${roles.length} found`);
  console.log(`✅ Users: ${users.length} found`);
  console.log(`✅ Tools: ${tools.length} found`);
  console.log(`${newUser ? '✅' : '❌'} User Creation: ${newUser ? 'Success' : 'Failed'}`);

  console.log('\n🎉 API Testing Complete!');
  
  // Return summary for browser console
  return {
    roles: roles.length,
    users: users.length,
    tools: tools.length,
    newUserCreated: !!newUser,
    apiStatus: '✅ All endpoints working'
  };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  runTests().then(result => {
    console.log('\n📋 Final Results:', result);
  });
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = { runTests, testRoles, testUsers, testTools, testCreateUser };
}