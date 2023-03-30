/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import "./ListStudent.css";
import ListSV from "./Components/ListSV";
import { Link } from "react-router-dom";
import CallApi from "../API/CallApi";
import ExportToExcel from "./Components/ExportData";

class ListStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      scores: [],
      lop: [],
      namhoc: [],
      hocky: [],
      item: sessionStorage.getItem("item"),
    };
  }

  componentDidMount() {
    this.setState({
      lop: sessionStorage.getItem("lop").split(", "),
      namhoc: [
        "2020 - 2021",
        "2021 - 2022",
        "2022 - 2023",
        "2023 - 2024",
        "2024 - 2025",
      ],
      hocky: ["HỌC KỲ 1", "HỌC KỲ 2"],
    });
    var item = sessionStorage.getItem("item");
    CallApi(`student/allscore/${item}`, "GET", null).then((res) => {
      if (res.data.ListStudents != null) {
        this.setState({
          students: [res.data.ListStudents],
          scores: [res.data.ListScores],
        });
      } else {
        this.setState({
          students: [],
          scores: [],
        });
      }
    });
  }

  ChooseClass = (item) => {
    sessionStorage.setItem("item", item);
    CallApi(`student/all/${item}`, "GET", null).then((res) => {
      if (res.data.ListStudents != null) {
        this.setState({
          students: res.data.ListStudents,
        });
      } else {
        this.setState({
          students: [],
        });
      }
    });
  };

  GetData = () => {
    var year =
      sessionStorage.getItem("scholastic") + sessionStorage.getItem("semester");
    CallApi(`student/allscore/${year}`, "GET", null).then((res) => {
      if (res.data.ListScores != null) {
        this.setState({
          scores: res.data.ListScores,
        });
      } else {
        this.setState({
          scores: [],
        });
      }
    });
  };

  ChooseScholastic = (event) => {
    var target = event.target;
    var value = target.value;
    sessionStorage.setItem("scholastic", value);
    this.setState({
      namhoc: value,
    });
    this.GetData();
  };

  ChooseSemester = (event) => {
    var target = event.target;
    var value = target.value;
    sessionStorage.setItem("semester", value);
    this.setState({
      hocky: value,
    });
    this.GetData();
  };

  findIndex = (_id) => {
    var { students } = this.state;
    var result = -1;
    students.forEach((student, index) => {
      if (student._id === _id) result = index;
    });
    return result;
  };

  onDelete = (_id, msv) => {
    var { students } = this.state;
    CallApi(`student/delete/${_id}`, "DELETE", null).then((res) => {
      if (res.status === 200) {
        var index = this.findIndex(_id);
        if (index !== -1) {
          students.splice(index, 1);
          this.setState({
            students: students,
          });
        }
      }
    });
    CallApi(`delete-student-account/${msv}`, "DELETE", null);
  };

  render() {
    var { lop, students, scores, namhoc, hocky } = this.state;
    return (
      <div className="Container">
        <div className="text_center">
          <h1 id="qlsv">Quản lý sinh viên</h1>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          &nbsp;
          <div className="dropdown">
            <button
              type="button"
              className="btn dropdown-toggle"
              id="dropdownMsv"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              Lớp &nbsp; <span className="fa fa-caret-square-o-down"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              {lop.map((item) => (
                <li
                  to="/home/list-students"
                  key={item}
                  onClick={() => this.ChooseClass(item)}
                >
                  <a role="button">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <label
            style={{
              paddingTop: "8px",
              paddingBottom: "2px",
              marginRight: "10px",
            }}
          >
            {sessionStorage.getItem("item")}
          </label>
          <div className="dropdown">
            <select
              className="form-control"
              name="scholastic"
              value={namhoc}
              onChange={this.ChooseScholastic}
            >
              <option value="0"></option>
              <option value="2021">2020 - 2021</option>
              <option value="2122">2021 - 2022</option>
              <option value="2223">2022 - 2023</option>
              <option value="2324">2023 - 2024</option>
              <option value="2425">2024 - 2025</option>
            </select>
          </div>
          <div className="dropdown">
            <select
              className="form-control"
              name="scholastic"
              value={hocky}
              onChange={this.ChooseSemester}
            >
              <option value="0"></option>
              <option value="HK1">HK1</option>
              <option value="HK2">HK2</option>
            </select>
          </div>
          <Link to="/home/list-students/add" className="btn btn-primary">
            <span className="fa fa-plus"></span> &nbsp; Thêm sinh viên
          </Link>{" "}
          &nbsp;
          <div className="data">
            <ExportToExcel apiData={scores} fileName={this.state.item} />
          </div>
          &nbsp;
          <Link
            to="/home/list-students/import-data"
            className="btn btn-primary data"
          >
            <span className="fa fa-file-import"></span>&nbsp; Nhập dữ liệu từ
            Excel
          </Link>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <ListSV
                students={students}
                scores={scores}
                onDelete={this.onDelete}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListStudent;
