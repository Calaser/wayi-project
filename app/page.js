'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentData, setCurrentData] = useState([]);

  async function submitHandler(e) {
    e.preventDefault();

    let response = await axios.post("https://wayi.league-funny.com/api/task?page=1", { name: name, description: description, isCompleted: false });
    console.log(response);
    fetchData();
  }

  async function fetchData() {
    try {
      let dataArray = [];
      let response = await axios.get("https://wayi.league-funny.com/api/task?page=1");
      dataArray = response.data.data;
      let dataCount = response.data.total;
      for (let i = 1; dataCount > 10 * i; i++) {
        response = await axios.get(`https://wayi.league-funny.com/api/task?page=${i + 1}`);
        dataArray = [...dataArray, ...response.data.data]
      }
      setCurrentData(dataArray);
    } catch (error) {
      console.log("Error fetch:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={(e) => submitHandler(e)}>
        <h1>My ToDo List</h1>
        <div>
          <label htmlFor="nameInput">任務名稱</label>
          <input id="nameInput" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="descriptionInput">任務描述</label>
          <textarea id="descriptionInput" type="textarea" value={description} rows={5} maxLength={30} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <button type="submit">新增任務</button>
      </form>

      <ul className={styles.list}>
        {currentData.map(task =>
          <li key={task.id}>
            <h1>{task.name}</h1>
            <p>{task.description} {task.isCompleted ? " O " : " X "}</p>
          </li>
        )
        }
      </ul>

    </main>
  );
}
