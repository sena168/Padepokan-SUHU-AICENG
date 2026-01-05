// Simple test utility to verify localStorage persistence
export function testAuthStorage() {
  // Clear any existing test data
  localStorage.removeItem('padepokan_users');
  localStorage.removeItem('padepokan_user');

  // Test user data
  const testUser = {
    id: 'test-user-123',
    nickname: 'Test Murid',
    email: 'test@padepokan.com',
    createdAt: new Date().toISOString(),
  };

  // Test saving user
  localStorage.setItem('padepokan_user', JSON.stringify(testUser));

  // Test saving users array
  const users = [testUser];
  localStorage.setItem('padepokan_users', JSON.stringify(users));

  // Test reading back
  const storedUser = localStorage.getItem('padepokan_user');
  const storedUsers = localStorage.getItem('padepokan_users');

  console.log('🔍 Authentication Storage Test Results:');
  console.log('Stored User:', storedUser ? JSON.parse(storedUser) : 'None');
  console.log('Stored Users:', storedUsers ? JSON.parse(storedUsers) : 'None');

  // Clean up
  localStorage.removeItem('padepokan_users');
  localStorage.removeItem('padepokan_user');

  return {
    userStored: !!storedUser,
    usersStored: !!storedUsers,
    userData: storedUser ? JSON.parse(storedUser) : null,
    usersData: storedUsers ? JSON.parse(storedUsers) : null,
  };
}

// Test lesson progress storage
export function testLessonStorage() {
  const userId = 'test-user-123';
  const testLessons = [
    {
      id: 'kitab-kosong',
      title: 'Kitab Kosong',
      subtitle: 'Master Prompting',
      status: 'completed' as const,
      content: {
        header: 'Test Header',
        body: 'Test Body',
      },
    },
  ];

  // Test saving lessons
  localStorage.setItem(
    `padepokan_lessons_${userId}`,
    JSON.stringify(testLessons)
  );

  // Test reading back
  const storedLessons = localStorage.getItem(`padepokan_lessons_${userId}`);

  console.log('📚 Lesson Storage Test Results:');
  console.log(
    'Stored Lessons:',
    storedLessons ? JSON.parse(storedLessons) : 'None'
  );

  // Clean up
  localStorage.removeItem(`padepokan_lessons_${userId}`);

  return {
    lessonsStored: !!storedLessons,
    lessonsData: storedLessons ? JSON.parse(storedLessons) : null,
  };
}
