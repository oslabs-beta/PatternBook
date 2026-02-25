import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface User {
  id: string;
  name: string;
  email: string;
}

// Helper function
const formatUserName = (name: string) => {
  return name.toUpperCase();
};

export const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // API Call Example 1: fetch
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  const handleUpdate = async () => {
    // API Call Example 2: fetch with method
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ id: userId, name: 'Updated Name' }),
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h1>{formatUserName(user.name)}</h1>
      <p>{user.email}</p>
      <Button onClick={handleUpdate}>Update Profile</Button>
    </div>
  );
};