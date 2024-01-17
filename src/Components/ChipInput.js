import React, { useState, useRef, useEffect } from 'react';
import './ChipInput.css';
import profilePic from '../assets/cat.png'


import userData from '../user.json';

const ChipInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [allUsers, setAllUsers] = useState(userData.users);
  const inputRef = useRef(null);
  const suggestionListRef = useRef(null);

  const [filteredItems, setFilteredItems] = useState([]);
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);


    const filtered = allUsers.filter(
      (user) =>
        !chips.includes(user) &&
        (user.full_name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredItems(filtered);
    setIsSuggestionListOpen(true);
  };

  const handleUserClick = (user) => {
    const updatedChips = [...chips, user];
    const updatedAllUsers = allUsers.filter((u) => u !== user);

    setChips(updatedChips);
    setFilteredItems([]);
    setAllUsers(updatedAllUsers);
    setInputValue('');
    setIsSuggestionListOpen(false);
  };

  const handleChipRemove = (removedChip) => {
    const updatedChips = chips.filter((chip) => chip !== removedChip);
    const updatedAllUsers = [...allUsers, removedChip];

    setChips(updatedChips);
    setFilteredItems([]);
    setAllUsers(updatedAllUsers);
  };

  const handleBackspacePress = (e) => {
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      highlightAndRemoveChip(lastChip);
    }
  };

  const highlightAndRemoveChip = (chip) => {
    const chipElement = document.querySelector(`[data-chip="${chip.id}"]`);
    if (chipElement) {
      chipElement.classList.add('highlight');
      setTimeout(() => {
        handleChipRemove(chip);
        chipElement.classList.remove('highlight');
      }, 500);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
    document.addEventListener('click', handleClickOutside);


    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (
      suggestionListRef.current &&
      !suggestionListRef.current.contains(e.target) &&
      inputRef.current !== e.target
    ) {
      setIsSuggestionListOpen(false);
    }
  };

  return (
    <div className="chip-input bg-purple-200 flex flex-col items-center justify-center">
      <h1 className="text-3xl text-white mb-4">Add Users</h1>
      <div className="chips">
        {chips.map((user) => (
          <div key={user.id} className="chip" data-chip={user.id}>
            <img
              src={profilePic}
              alt={user.full_name}
              className="profile-picture"
            />
            <div className="user-info">
              <div className="full-name">{user.full_name}</div>
              <div className="email">{user.email}</div>
            </div>
            <button
              className="remove-chip"
              onClick={() => handleChipRemove(user)}
            >
              X
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleBackspacePress}
          placeholder="Type to search"
          ref={inputRef}
          className="bg-white rounded p-2 mb-4"
        />
      </div>
      {isSuggestionListOpen && inputValue && (
        <div className="suggestion-list" ref={suggestionListRef}>
          {filteredItems.map((user) => (
            <div
              key={user.id}
              className="suggestion-item"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={profilePic}
                alt={user.full_name}
                className="profile-picture"
              />
              <div className="user-info">
                <div className="full-name">{user.full_name}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default ChipInput;
