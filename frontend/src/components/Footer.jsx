import React, { useState, useEffect } from "react";
import "./Footer.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Footer = ({ onEventTypeSelect, showAllEvents,showMyEvents }) => {
  const [eventTypes, setEventTypes] = useState([]);

  const [showForm, setShowForm] = useState(false); // State za prikaz forme
  const [newEventType, setNewEventType] = useState({ naziv: "", opis: "" });
  const [uloga, setUloga] = useState("");

  useEffect(() => {
    const cachedTipovi = localStorage.getItem("tipovi");
    if (cachedTipovi) {
      setEventTypes(JSON.parse(cachedTipovi));
    } else {
      fetchEventTypes();
    }
  }, []);

  const fetchEventTypes = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("Korisnik nije autentifikovan.");
        return;
      }
      const ul = localStorage.getItem("role");
      setUloga(ul);
      console.log("uloga" + uloga);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tipoviDogadjaja",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEventTypes(response.data.data);
      console.log(response.data.data);
      localStorage.setItem("tipovi", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Greška pri dobavljanju tipova događaja:", error);
    }
  };

  const handleEventTypeSelect = (eventType) => {
    onEventTypeSelect(eventType.id); // Prosleđujemo samo ID tipa događaja
  };
  useEffect(() => {
    fetchEventTypes();
  }, []);
  const handleShowAllEvents = () => {
    showAllEvents(); //ovo nam treba za kalendar, da javimo da vrati sve dogadjaje za korisnika
  };
  const handleShowMyEvents = () => {
    showMyEvents(); //ovo nam treba za kalendar, da javimo da vrati dogadjaje konkretnog korisnika
  };
  const handleNewEventTypeChange = (e) => {
    const { name, value } = e.target;
    setNewEventType({ ...newEventType, [name]: value });
  };

  const handleSubmitNewEventType = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("Korisnik nije autentifikovan.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/tipoviDogadjaja",
        newEventType,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEventTypes([...eventTypes, response.data.data]);
      setNewEventType({ naziv: "", opis: "" });
      // console.log(newEventType);
      setShowForm(false);
      console.log("Novi tip događaja je uspešno dodat:", response.data.data);
    } catch (error) {
      console.error("Greška pri dodavanju novog tipa događaja:", error);
    }
  };

  const handleDeleteEventType = async (id, idKorisnika) => {
    if (idKorisnika === null) {
      alert("Ne možete obrisati javni tip događaja.");
      return;
    }

    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj tip događaja?"
    );
    if (!confirmDelete) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("Korisnik nije autentifikovan.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/tipoviDogadjaja/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEventTypes(eventTypes.filter((type) => type.id !== id));
      console.log("Tip događaja je uspešno obrisan.");
    } catch (error) {
      console.error("Greška pri brisanju tipa događaja:", error);
    }
  };

  return (
    <div className="footer">
      <div className="left-links">
        <div className="dropdown">
          <button className="dropbtn">Tipovi Događaja</button>
          <div className="dropdown-content">
            {eventTypes.map((type) => (
              <div
                key={type.id}
                className={
                  type.idKorisnika === null
                    ? "public-event-type"
                    : "user-event-type"
                }
              >
                <a onClick={() => handleEventTypeSelect(type)}>
                  {type.naziv}
                  <span className="tooltip">{type.opis}</span>
                </a>
                {type.idKorisnika !== null && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() =>
                      handleDeleteEventType(type.id, type.idKorisnika)
                    }
                    className="delete-icon"
                  />
                )}
              </div>
            ))}
            {
              <a
                className="add-new-type"
                onClick={() => setShowForm(!showForm)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </a>
            }
          </div>
        </div>
        {/* <button className="new-type-btn" onClick={() => setShowForm(!showForm)}>Novi tip</button> */}
        <button className="show-all-btn" onClick={handleShowAllEvents}>
          Svi događaji
        </button>
        <button className="show-my-btn" onClick={handleShowMyEvents}>
          Moji događaji
        </button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-btn"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmitNewEventType}>
              <label htmlFor="naziv">
                Naziv tipa <span className="required">*</span>
              </label>
              <input
                type="text"
                name="naziv"
                placeholder="Naziv tipa događaja"
                value={newEventType.naziv}
                onChange={handleNewEventTypeChange}
                required
              />
              <label>Opis tipa</label>
              <input
                type="text"
                name="opis"
                placeholder="Opis tipa događaja"
                value={newEventType.opis}
                onChange={handleNewEventTypeChange}
              />
              <button class="submit-button" type="submit">
                Dodaj tip događaja
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
