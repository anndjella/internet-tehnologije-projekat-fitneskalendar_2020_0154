import React, { useState, useEffect } from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../ApiService";
import { toast } from "react-toastify";


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
  const prikaziToast = (poruka, uspesno) => {
    if (uspesno) {
      toast.success(poruka, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(poruka, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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
      const response = await api.vratiTipoveDogadjaja(authToken);
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

      const response = await api.napraviTipDogadjaja(newEventType,authToken);
      setEventTypes([...eventTypes, response.data.data]);
      setNewEventType({ naziv: "", opis: "" });
      // console.log(newEventType);
      setShowForm(false);
      console.log("Novi tip događaja je uspešno dodat:", response.data.data);
      prikaziToast("Event type has been saved.",true);
    } catch (error) {
      console.error("Greška pri dodavanju novog tipa događaja:", error);
      prikaziToast("Event type could not be saved.",false);
    }
  };

  const handleDeleteEventType = async (id, idKorisnika) => {
    if (idKorisnika === null) {
      prikaziToast("You can't delete public event type.",false);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event type?"
    );
    if (!confirmDelete) return;

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("Korisnik nije autentifikovan.");
        return;
      }

      await api.izbrisiTipDogadjaja(id,authToken);
      setEventTypes(eventTypes.filter((type) => type.id !== id));
      console.log("Tip događaja je uspešno obrisan.");
      prikaziToast("Event type has been deleted.",true);
    } catch (error) {
      console.error("Greška pri brisanju tipa događaja:", error);
      prikaziToast("Event type could not be deleted",false);
    }
  };

  return (
    <div className="footer">
      <div className="left-links">
        <div className="dropdown">
          <button className="dropbtn">Event types</button>
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
          All events
        </button>
        <button className="show-my-btn" onClick={handleShowMyEvents}>
          My events
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
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="naziv"
                placeholder="Name of an event type"
                value={newEventType.naziv}
                onChange={handleNewEventTypeChange}
                required
              />
              <label>Description</label>
              <input
                type="text"
                name="opis"
                placeholder="Description of an event type"
                value={newEventType.opis}
                onChange={handleNewEventTypeChange}
              />
              <button class="submit-button" type="submit">
                Add event type
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
