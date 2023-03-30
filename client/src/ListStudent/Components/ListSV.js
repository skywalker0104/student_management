/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sort from "./Sort";
import OneRowData from "./OneRowData";
import CallApi from "./../../API/CallApi";

class ListSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: this.props.students,
      scores: this.props.scores,
      filter: {
        msv: "",
        name: "",
        gender: "",
        drl: "",
        tbhk: "",
        gpa: "",
        status: "",
      },
      sort: {
        by: "msv",
        value: 1,
      },
    };
    sessionStorage.setItem("drl", "0-101");
    sessionStorage.setItem("tbhk", "0-4.1");
    sessionStorage.setItem("gpa", "0-4.1");
  }

  componentDidMount() {
    this.setState({
      students: this.props.students,
      scores: this.props.scores,
    });
  }

  onDelete = (_id, msv) => {
    this.props.onDelete(_id, msv);
  };

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    if (name === "drl") sessionStorage.setItem("drl", value);
    if (name === "tbhk") sessionStorage.setItem("tbhk", value);
    if (name === "gpa") sessionStorage.setItem("gpa", value);
    this.setState({
      filter: {
        [name]: value,
      },
    });
  };

  onSort = (sortBy, sortValue) => {
    this.setState({
      sort: {
        by: sortBy,
        value: sortValue,
      },
    });
  };

  render() {
    var { filter, sort } = this.state;
    var students = this.props.students;
    var scores = this.props.scores;
    // console.log(scores);
    if (filter) {
      if (filter.msv) {
        students = students.filter((student) => {
          return student.msv.indexOf(filter.msv) === 0;
        });
      }
      if (filter.name) {
        students = students.filter((student) => {
          return student.name.indexOf(filter.name) !== -1;
        });
      }
      if (filter.gender) {
        students = students.filter((student) => {
          if (filter.gender === "all") return true;
          else return student.gender === filter.gender;
        });
      }
      if (filter.drl || filter.tbhk || filter.gpa) {
        scores = scores.filter((score) => {
          var drl = sessionStorage.getItem("drl").toString().split("-");
          var tbhk = sessionStorage.getItem("tbhk").toString().split("-");
          var gpa = sessionStorage.getItem("gpa").toString().split("-");
          return (
            score.drl >= drl[0] &&
            score.drl <= drl[1] &&
            score.tbhk >= tbhk[0] &&
            score.tbhk <= tbhk[1] &&
            score.gpa >= gpa[0] &&
            score.gpa <= gpa[1]
          );
        });
      }
      if (filter.status) {
        scores = scores.filter((score) => {
          if (filter.status === "all") return true;
          else return score.status === filter.status;
        });
      }
    }

    if (sort) {
      if (sort.by === "msv") {
        students.sort((student1, student2) => {
          if (student1.msv > student2.msv) return sort.value;
          else if (student1.msv < student2.msv) return -sort.value;
          else return 0;
        });
      } else if (sort.by === "name") {
        students.sort((student1, student2) => {
          if (student1.name.localeCompare(student2.name) < 0) return sort.value;
          else if (student1.name.localeCompare(student2.name) > 0)
            return -sort.value;
          else return 0;
        });
      } else if (sort.by === "tbhk") {
        scores.sort((score1, score2) => {
          if (score1.tbhk > score2.tbhk) return sort.value;
          else if (score1.tbhk < score2.tbhk) return -sort.value;
          else return 0;
        });
      } else if (sort.by === "gpa") {
        scores.sort((score1, score2) => {
          if (score1.gpa > score2.gpa) return sort.value;
          else if (score1.gpa < score2.gpa) return -sort.value;
          else return 0;
        });
      } else {
        scores.sort((score1, score2) => {
          if (score1.drl > score2.drl) return sort.value;
          else if (score1.drl < score2.drl) return -sort.value;
          else return 0;
        });
      }
    }
    const topStudent = scores;
    for (var i = 0; i < topStudent.length; i++) {
      for (var j = i + 1; j < topStudent.length; j++) {
        if (topStudent[i].lop === topStudent[j].lop)
          if (topStudent[i].tbhk < topStudent[j].tbhk) {
            const temp = topStudent[i];
            topStudent[i] = topStudent[j];
            topStudent[j] = temp;
          }
      }
    }
    for (var i = 0; i < Math.round(topStudent.length * 0.1); i++) {
      CallApi(`student/updateacademic/${topStudent[i]._id}`, "PATCH", {
        status: "Khen thưởng",
      });
    }
    var studentList = students.map((student, index) => {
      return scores.map((score) => {
        if (score.msv === student.msv && score.lop === student.lop) {
          if (score.tbhk < 1) {
            CallApi(`student/updateacademic/${score._id}`, "PATCH", {
              status: "Cảnh báo học tập",
            });
          } else if (
            (score.hocky === "2021HK2" && score.sum_of_credits < 16) ||
            (score.hocky === "2122HK2" && score.sum_of_credits < 36) ||
            (score.hocky === "2223HK2" && score.sum_of_credits < 71) ||
            (score.hocky === "2324HK2" && score.sum_of_credits < 106) ||
            (score.hocky === "2425HK1" && score.sum_of_credits < 141)
          ) {
            CallApi(`student/updateacademic/${score._id}`, "PATCH", {
              status: "Thiếu tín chỉ",
            });
          } else if (score.drl < 50) {
            CallApi(`student/updateacademic/${score._id}`, "PATCH", {
              status: "Đình chỉ học tập",
            });
          }
          return (
            <OneRowData
              key={student.id}
              index={index}
              student={student}
              score={score}
              onDelete={this.onDelete}
            />
          );
        }
      });
    });
    return (
      <div>
        <table className="table table-bordered table-hover">
          <Sort onSort={this.onSort} />
          <tbody>
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="msv"
                  value={filter.msv}
                  onChange={this.onChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={filter.name}
                  onChange={this.onChange}
                />
              </td>
              <td></td>
              <td>
                <select
                  className="form-control"
                  name="gender"
                  value={filter.gender}
                  onChange={this.onChange}
                >
                  <option value="all"></option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control"
                  name="drl"
                  value={filter.drl}
                  onChange={this.onChange}
                >
                  <option value="0-101"> </option>
                  <option value="90-100">90 - 100</option>
                  <option value="80-89">80 - 89</option>
                  <option value="65-79">65 - 79</option>
                  <option value="50-64">50 - 64</option>
                  <option value="35-49">35 - 49</option>
                  <option value="0-34">&lt; 34</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control"
                  name="tbhk"
                  value={filter.tbhk}
                  onChange={this.onChange}
                >
                  <option value="0-4"></option>
                  <option value="3.6-4.0">3.6 - 4.0</option>
                  <option value="3.2-3.5">3.2 - 3.5</option>
                  <option value="2.5-3.1">2.5 - 3.1</option>
                  <option value="2.0-2.4">2.0 - 2.4</option>
                  <option value="0-1.9">&lt; 1.9</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control"
                  name="gpa"
                  value={filter.gpa}
                  onChange={this.onChange}
                >
                  <option value="0-4.1"></option>
                  <option value="3.6-4.0">3.6 - 4.0</option>
                  <option value="3.2-3.6">3.2 - 3.6</option>
                  <option value="2.5-3.0">2.5 - 3.2</option>
                  <option value="2.0-2.5">2.0 - 2.5</option>
                  <option value="0-2.0">&lt; 2.0</option>
                </select>
              </td>
              <td>
                <select
                  className="form-control"
                  name="status"
                  value={filter.status}
                  onChange={this.onChange}
                >
                  <option value="all"></option>
                  <option value="Không">Không </option>
                  <option value="Cảnh báo học tập">Cảnh báo học tập</option>
                  <option value="Đình chỉ học tập">Đình chỉ học tập</option>
                  <option value="Thiếu tín chỉ">Thiếu tín chỉ</option>
                  <option value="Thiếu học phí">Thiếu học phí</option>
                  <option value="Khen thưởng">Khen thưởng</option>
                </select>
              </td>
              <td></td>
            </tr>
            {studentList}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListSV;
