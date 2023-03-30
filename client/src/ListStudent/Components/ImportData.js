/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./ImportData.css";
import axios from "axios";

class ImportData extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUploadStudent = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile
      // this.state.selectedFile.name
    );

    // Details of the uploaded file
    //console.log(this.state.selectedFile);
    axios
      .post("http://localhost:5000/student/create/import", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    alert("Đã thêm thành công");
  };

  onFileUploadScore = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile
      // this.state.selectedFile.name
    );

    // Details of the uploaded file
    //console.log(this.state.selectedFile);
    axios
      .post("http://localhost:5000/student/create/importScore", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    alert("Đã thêm thành công");
  };

  render() {
    return (
      <div className="container">
        <h1 className="title">Nhập dữ liệu từ file Excel</h1> <br /> <br />
        <Link to="/home/list-students" className="btn btn-danger">
          <span className="fa fa-arrow-left"></span> &nbsp; Quay lại
        </Link>
        <div className="import">
          <label> Nhập danh sách sinh viên: </label> <br />
          <label> Chọn file Excel đúng như định dạng bên dưới: </label> <br />
          <img src="https://i.imgur.com/41lPmLX.png" />
          <input
            type="file"
            className="form-control"
            name="file"
            onChange={this.onFileChange}
          />
        </div>{" "}
        <br />
        <div>
          {/* <Link to="/home/list-students" className="btn btn-danger">
            <span className="fa fa-arrow-left"></span> &nbsp; Quay lại
          </Link> */}
          <button
            type="submit"
            className="btn btn-primary mg-20"
            onClick={this.onFileUploadStudent}
          >
            <span className="fa fa-save"></span> &nbsp; Ghi nhận
          </button>{" "}
        </div>
        <div className="import">
          <label> Nhập điểm : </label> <br />
          <label> Chọn file Excel đúng như định dạng bên dưới: </label> <br />
          <img src="https://i.imgur.com/blPLZBc.png" />
          <input
            type="file"
            className="form-control"
            name="file"
            onChange={this.onFileChange}
          />
        </div>{" "}
        <br />
        <div>
          <button
            type="submit"
            className="btn btn-primary mg-20"
            onClick={this.onFileUploadScore}
          >
            <span className="fa fa-save"></span> &nbsp; Ghi nhận
          </button>{" "}
        </div>
      </div>
    );
  }
}

export default ImportData;
