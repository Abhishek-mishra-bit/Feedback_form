import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [feedbacks, setFeedbacks] = useState(() => {
    const storedFeedbacks = localStorage.getItem("feedbacks");
    return storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
  });
  const [newRating, setNewRating] = useState(1); // Default rating value
  const [name, setName] = useState(""); // Input field for name
  const [editIndex, setEditIndex] = useState(null); // Index of feedback being edited

  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Editing existing feedback
      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[editIndex] = {
        name: name,
        rating: newRating,
        date: new Date().toLocaleDateString(),
      };
      setFeedbacks(updatedFeedbacks);
      setEditIndex(null); // Reset edit mode
    } else {
      // Adding new feedback
      const newFeedback = {
        name: name,
        rating: newRating,
        date: new Date().toLocaleDateString(),
      };
      setFeedbacks([...feedbacks, newFeedback]);
    }
    setNewRating(1); // Reset rating after feedback submitted
    setName(""); // Reset name input field
  };

  const deleteFeedback = (index) => {
    const updatedFeedbacks = [...feedbacks];
    updatedFeedbacks.splice(index, 1);
    setFeedbacks(updatedFeedbacks);
  };

  const editFeedback = (index) => {
    const feedbackToEdit = feedbacks[index];
    setName(feedbackToEdit.name);
    setNewRating(feedbackToEdit.rating);
    setEditIndex(index);
  };

  // Calculate overall ratings count
  const overallRatingsCount = (rating) => {
    return feedbacks.filter((feedback) => feedback.rating === rating).length;
  };

  return (
    <div className="container">
      <h2>Feedback System</h2>

      <h5>Overall Ratings</h5>
      <div className="overall-ratings">
        <p>* {overallRatingsCount(1)}</p>
        <p>** {overallRatingsCount(2)}</p>
        <p>*** {overallRatingsCount(3)}</p>
        <p>**** {overallRatingsCount(4)}</p>
        <p>***** {overallRatingsCount(5)}</p>
      </div>

      <h2>{editIndex !== null ? "Edit Feedback" : "Feedback Form"}</h2>
      <form onSubmit={handleFeedbackSubmit}>
        <label htmlFor="name">Enter Your Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="rating">Choose Rating:</label>
        <select
          id="rating"
          value={newRating}
          onChange={(e) => setNewRating(parseInt(e.target.value))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="submit">
          {editIndex !== null ? "Edit Feedback" : "Submit Feedback"}
        </button>
        {editIndex !== null && (
          <button
            type="button"
            onClick={() => {
              setEditIndex(null);
              setName("");
              setNewRating(1);
            }}>
            Cancel
          </button>
        )}
      </form>

      <h4>Feedback History</h4>
      <ul className="feedback-list">
        {feedbacks.map((feedback, index) => (
          <li key={index}>
            <span>
              {feedback.name} rated {feedback.rating} stars on {feedback.date}
            </span>
            <button onClick={() => editFeedback(index)}>Edit</button>
            <button onClick={() => deleteFeedback(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
