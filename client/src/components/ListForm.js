// INPUT BOX FOR CREATING NEW LISTS

import React, { useState } from 'react';
import axios from 'axios';

const ListForm = ({ token, userId, refreshData }) => {
  const [listName, setListName] = useState('');

  const handleListSubmit = async (event) => {
    event.preventDefault();

    // Create a new task with default values
    const newList = {
        list_name: listName,
        user_id: parseInt(localStorage.getItem('user_id')) || null
      };

    axios
      .post('/api/lists', newList, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log('New List details:', response.data);
        // Clear the list title after successful submission
        setListName('');
        // Refresh list data
        refreshData();
      })
      .catch((error) => {
        console.error('Error creating list:', error);
      });
  };


  return (
    <div>
        <form onSubmit={handleListSubmit}>
          <button type="submit">
            <i class="fa-solid fa-plus"></i>
          </button>
          <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="New list"
              required
          />
        </form>
    </div>
  );
};

export default ListForm;