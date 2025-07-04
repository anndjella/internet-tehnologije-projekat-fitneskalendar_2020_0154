import React, { useState, useEffect } from "react";
import "./KorisniciPage.css";
import Popup from "reactjs-popup";
import { prikaziToast } from "./toast";
import "react-toastify/dist/ReactToastify.css";
import api from "../ApiService";

const Korisnici = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByLastName, setSortByLastName] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
  });

  useEffect(() => {
    const cachedUsers = localStorage.getItem("users");
    if (cachedUsers) {
      setUsers(JSON.parse(cachedUsers));
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.vratiKorisnike();
      const usersData = response.data.data;
      setUsers(response.data.data);
      localStorage.setItem("users", JSON.stringify(usersData));
      console.log(response.data.data);
    } catch (error) {
      console.error("Greška prilikom dobijanja korisnika:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log("id kor:" + id);

    try {
      const response = await api.izbrisiKorisnika(id);
      console.log(response);
      prikaziToast("User has been edited.",true);
      fetchUsers();
    } catch (error) {
      console.error("Greška prilikom brisanja korisnika:", error);
      prikaziToast("User could not be edited.",false);
    }
  };

  const handleEdit = (user) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setFormData({
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
    });
  };

  const handleSave = async (id, updatedData) => {
    try {
      await api.izmeniKorisnika(id,updatedData);
      setEditingUser(null);
      fetchUsers();
      prikaziToast("User has been edited.",true);
    } catch (error) {
      console.error("Greška prilikom izmene korisnika:", error);
      prikaziToast("User could not be edited.",false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = () => {
    setSortByLastName(!sortByLastName);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.ime || ""} ${user.prezime || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const sortedUsers = sortByLastName
    ? filteredUsers.sort((a, b) =>
        (a.prezime || "").localeCompare(b.prezime || "")
      )
    : filteredUsers;

  return (
    <div className="admin-page">
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearch}
      />
      <label class="labela">
        <input type="checkbox" checked={sortByLastName} onChange={handleSort} />
          <span class="sort">Sort by Last name</span> 
      </label>
      <ul>
        <li className="header">
          <div>Name</div>
          <div>Last name</div>
          <div>Email</div>
        </li>
        {sortedUsers.map((user) => (
          <li key={user.id}>
            <div>{user.ime}</div>
            <div>{user.prezime}</div>
            <div>{user.email}</div>
            <div className="actions">
              <button onClick={() => handleEdit(user)}>Edit</button>
              <Popup
                trigger={<button>Delete</button>}
                modal
                closeOnDocumentClick={false}
                contentStyle={{ width: "fit-content", padding: "20px" }}
              >
                {(close) => (
                  <div className="popup-content">
                    <h5>
                      Are you sure you want to delete user {user.ime}{" "}
                      {user.prezime}?
                    </h5>
                    <div className="popup-actions">
                      <button
                        onClick={() => {
                          handleDelete(user.id);
                          close();
                        }}
                      >
                        Yes
                      </button>
                      <button onClick={close}>No</button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </li>
        ))}
      </ul>
      {editingUser && (
        <div className="form-overlay">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave(editingUser.id, formData);
            }}
            className="edit-user-form"
          >
            <h3>Edit user</h3>
            <label>
              Name:
              <input
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
              />
            </label>
            <label>
              Last name:
              <input
                type="text"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Korisnici;
