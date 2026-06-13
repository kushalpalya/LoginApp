import { useState, useEffect } from "react";
import axios from "axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios.get("https://loginapp-backend-8847.onrender.com/api/skills")
      .then(res => setSkills(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://loginapp-backend-8847.onrender.com/api/skills", {
      skill_name: name
    });
    alert("Skill Added!");
    setName("");
    fetchSkills();
  };

  return (
    <div>
      <h2>Skills</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Skill Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Skill</button>
      </form>
      <ul>
        {skills.map(skill => (
          <li key={skill.id}>{skill.skill_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;