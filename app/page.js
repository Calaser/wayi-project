'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [isSubmitInvalidData, setIsSubmitInvalidData] = useState(false);
  const [isHideCompletedTask, setIsHideCompletedTask] = useState(false);

  function keyboardInputHandler(e) {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  }

  function showCompletedTaskHandler() {
    setIsHideCompletedTask(prev => !prev);
  }

  async function fetchData() {
    try {
      let dataArray = [];
      let response = await axios.get("https://wayi.league-funny.com/api/task?page=1");
      dataArray = response.data.data;
      let dataCount = response.data.total;
      for (let i = 1; dataCount > 10 * i; i++) {
        response = await axios.get(`https://wayi.league-funny.com/api/task?page=${i + 1}`);
        dataArray = [...dataArray, ...response.data.data];
      }
      setCurrentData(dataArray);
    } catch (error) {
      console.log("Error fetch:", error);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    try {
      if (name.length > 10 || name.length < 1 || description.length > 30) {
        setIsSubmitInvalidData(true);
        return;
      }
      else {
        setIsSubmitInvalidData(false);
        await axios.post("https://wayi.league-funny.com/api/task", {
          name: name,
          description: description,
          isCompleted: false
        });
        fetchData();
        setName("");
        setDescription("");
      }
    } catch (error) {
      console.log("Error fetch:", error);
    }
  }

  async function stateChangeHandler(task) {
    try {
      await axios.patch(`https://wayi.league-funny.com/api/task/${task.id}`);
      await axios.put(`https://wayi.league-funny.com/api/task/${task.id}`, {
        name: task.name,
        description: task.description,
        updated_at: new Date().toISOString()
      });
      fetchData();
    } catch (error) {
      console.log("Error fetch:", error);
    }
  }

  async function deleteHandler(task) {
    try {
      await axios.delete(`https://wayi.league-funny.com/api/task/${task.id}`);
      fetchData();
    } catch (error) {
      console.log("Error fetch:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={(e) => submitHandler(e)} onKeyDown={(e) => keyboardInputHandler(e)}>
        <h1>My ToDo List</h1>
        <div className={(isSubmitInvalidData && (name.length > 10 || name.length < 1)) ? styles.invalid : null}>
          <label htmlFor="nameInput">任務名稱</label>
          <input id="nameInput" type="text" value={name} maxLength={10} onChange={(e) => setName(e.target.value)}></input>
          <p>必填 字數上限為10個字</p>
        </div>
        <div className={(isSubmitInvalidData && description.length > 30) ? styles.invalid : null}>
          <label htmlFor="descriptionInput">任務描述</label>
          <textarea id="descriptionInput" type="textarea" value={description} rows={5} maxLength={30} onChange={(e) => setDescription(e.target.value)}></textarea>
          <p>非必填 字數上限為30個字</p>
        </div>
        <span className={styles.warning}>{isSubmitInvalidData ? "資料格式有誤 請修改內容後再送出" : null}</span>
        <button type="submit">新增任務</button>
      </form>

      <ul className={styles.list}>
        <div className={styles.filter}>
          <button onClick={() => showCompletedTaskHandler()}>{isHideCompletedTask ? "點擊顯示已完成任務" : "點擊隱藏已完成任務"}</button>
        </div>
        {currentData.filter(task => (isHideCompletedTask) ? !task.is_completed : task).map(task =>
          <li key={task.id}>
            <h1>{task.name}</h1>
            <p>{task.description}</p>
            <button className={`${styles.status} ${task.is_completed ? styles.completed : null}`} onClick={() => stateChangeHandler(task)}>{task.is_completed ? "任務已完成" : "任務未完成"}</button>
            <button className={styles.delete} onClick={() => deleteHandler(task)}>刪除任務</button>
          </li>
        )
        }
      </ul>

    </main>
  );
}
