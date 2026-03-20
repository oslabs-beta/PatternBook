import React, { useEffect, useState } from 'react';
import { Button } from './Button';
<<<<<<< HEAD
import { useAuth } from './useAuth';
import { useAppStore } from './store';
=======
>>>>>>> origin/main

interface User {
  id: string;
  name: string;
  email: string;
}

<<<<<<< HEAD
// Helper function
const formatUserName = (name: string) => {
  return name.toUpperCase();
};

export const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const { addNotification } = useAppStore();
  const { login } = useAuth();
=======
export const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
>>>>>>> origin/main

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
<<<<<<< HEAD
    addNotification();
    login();
=======
>>>>>>> origin/main
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
<<<<<<< HEAD
      <h1>{formatUserName(user.name)}</h1>
=======
      <h1>{user.name}</h1>
>>>>>>> origin/main
      <p>{user.email}</p>
      <Button onClick={handleUpdate}>Update Profile</Button>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/main
