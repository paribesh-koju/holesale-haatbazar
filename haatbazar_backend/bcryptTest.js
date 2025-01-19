const bcrypt = require('bcrypt');

// Plain text password used for testing
const plainPassword = 'password1'; // Replace with the actual password you want to test

const testPasswordConsistency = async () => {
  try {
    // Hash the plain password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed Password:', hashedPassword);

    // Store hashedPassword somewhere for manual comparison later, or directly test below

    // Compare the plain password with the newly hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password matches newly hashed password:', isMatch); // should be true

    // Assuming we store the hashedPassword from registration in the database
    const storedHashedPassword = hashedPassword; // Simulate fetching from database

    // Compare the plain password with the stored hashed password
    const isMatchWithStoredHash = await bcrypt.compare(plainPassword, storedHashedPassword);
    console.log('Password matches with stored hash:', isMatchWithStoredHash); // should be true
  } catch (err) {
    console.error('Error:', err);
  }
};

testPasswordConsistency();
