'use client';
import { get } from '@/utils/network';
import { useState, useEffect } from 'react';

const CustomerTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await get("/user/userMetrics");
        console.log(response)
        setUsers(response)
      } catch (err) {
        setError("Error fetching user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <table className="table bordered-table sm-table mb-0">
    <thead>
      <tr>
        <th scope="col">DP</th>
        <th scope="col">ID</th>
        <th scope="col">Customer</th>
        <th scope="col">Points</th>
        <th scope="col">Redeemed</th>
        <th scope="col">Total Visits</th>
      </tr>
    </thead>
    <tbody>
      {users.length > 0 ? (
        users.map((user) => (
          <tr key={user.id}>
            <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#666',
                    border: '1px solid #eaeaea'
                  }}>
                    {user.photo_url ? (
                      <img 
                        src={user.photo_url} 
                        alt=""
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      getInitials(user.full_name)
                    )}
                  </div>
                </div>
            </td>
            <td>{user.id}</td>
            
            <td><span>{user.full_name}</span></td>
            <td>{user.points}</td>
            <td>{user.redeemed ? "Yes" : "No"}</td>
            <td>{user.total_visits}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="text-center py-2">
            No customers available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
  );
};

export default CustomerTable;