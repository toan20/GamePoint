import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [btnplay, setbtnplay] = useState("Play");
  const [buttons, setButtons] = useState([]);
  const timeRef = useRef(0);
  const intervalRef = useRef(null);
  const pRef = useRef(null);
  const pointsRef = useRef(0);
  const btnref = useRef([]);

  // Lấy giá trị input
  function handleInput(e) {
    pointsRef.current = e.target.value;
  }
  //
  function isOverlapping(newTop, newLeft, existingButtons) {
    const buffer = 50; // Khoảng cách tối thiểu giữa các nút (theo pixel)
    return existingButtons.some((button) => {
      const topDiff = Math.abs(button.top - newTop);
      const leftDiff = Math.abs(button.left - newLeft);
      return topDiff < buffer && leftDiff < buffer;
    });
  }
  // click mỗi nút point
  function handleClickButton(id) {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, hidden: true } : button
      )
    );
    btnref.current.push(id);

    if (
      isSubsequenceAndSorted(
        buttons.map((b) => b.id),
        btnref.current
      )
    ) {
      console.log("Correct sequence!");
      if (
        result(
          buttons.map((b) => b.id),
          btnref.current
        )
      ) {
        alert("Chiến Thắng");
        clearInterval(intervalRef.current);
      }
    } else {
      alert("Thất bại");
      clearInterval(intervalRef.current);
    }
  }
  // hàm kiếm tra kết quả chiến thắng
  function result(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  // hàm kiểm tra
  function isSubsequenceAndSorted(A, B) {
    // Nếu mảng B rỗng, trả về false
    if (B.length === 0) return false;

    // Kiểm tra nếu phần tử đầu tiên của B không phải là phần tử đầu tiên của A
    if (A[0] !== B[0]) return false;

    let i = 0; // Con trỏ cho mảng A
    let j = 0; // Con trỏ cho mảng B

    // Duyệt qua cả hai mảng A và B
    while (i < A.length && j < B.length) {
      if (A[i] === B[j]) {
        j++; // Di chuyển con trỏ của B nếu phần tử khớp
      } else if (j > 0) {
        return false; // Nếu đã bắt đầu khớp mà lại không khớp nữa, thì trả về false
      }
      i++;
    }

    // Đảm bảo tất cả các phần tử của B đã được duyệt
    return j === B.length;
  }
  // click nút play/resstart & xử lý tạo các nút point vị trí ngẫu nhiên và đếm time
  function handleClick() {
    setbtnplay("Restart");
    // Tạo mảng các nút mới và đảm bảo chúng không bị ẩn
    const newButtons = [];
    btnref.current = [];

    for (let i = 1; i <= pointsRef.current; i++) {
      let top, left;
      do {
        top = Math.floor(Math.random() * 400); // Giá trị top ngẫu nhiên
        left = Math.floor(Math.random() * 400); // Giá trị left ngẫu nhiên
      } while (isOverlapping(top, left, newButtons)); // Kiểm tra trùng lặp vị trí
      newButtons.push({ id: i, top, left, hidden: false }); // Đẩy đối tượng có id và vị trí vào mảng
    }
    setButtons(newButtons);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      timeRef.current = 0;
    }
    if (pRef.current) {
      pRef.current.textContent = `0`;
    }

    intervalRef.current = setInterval(() => {
      timeRef.current += 1;
      pRef.current.textContent = `${timeRef.current}`;
    }, 1000);
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="App">
      <h1>Let's play</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Points :</p>
        <input type="number" onChange={handleInput} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Time :</p>
        <p ref={pRef}>{timeRef.current}</p>
      </div>
      <button onClick={handleClick}>{btnplay}</button>
      <div className="container">
        {buttons.map(
          (button) =>
            !button.hidden && (
              <button
                key={button.id}
                className="random-button"
                style={{ top: `${button.top}px`, left: `${button.left}px` }}
                onClick={() => handleClickButton(button.id)}
              >
                {button.id}
              </button>
            )
        )}
      </div>
    </div>
  );
}

export default App;
