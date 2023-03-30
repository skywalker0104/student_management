/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import home from "./home.png";
import "../NavBar.css";
export default class Home extends Component {
  render() {
    return (
      <div id="main">
        <div className="homepage">
          <hr className="elements" id="homehr" />
          <div className="introduction">
            <h1 className="manage">
              TRƯỜNG CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
            </h1>
            <img className="homewallpaper" src={home} />
          </div>
        </div>
      </div>
    );
  }
}
