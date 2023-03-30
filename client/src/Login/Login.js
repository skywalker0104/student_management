/* eslint-disable react/jsx-pascal-case */
import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Body = styled.div`
  // background-color: rgb(186, 248, 255);
  background-image: url(https://wallpaperaccess.com/full/260168.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  height: 100vh;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const _Input = styled.input`
  border: 0;
  border-bottom: 2px solid #0ca5b3;
  outline: 0;
  background: transparent;
  width: 60%;
`;
const _Button = styled.button`
  width: 260px;
  margin-left: 70px;
  height: 40px;
  background-color: #0ca5b3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  opacity: 0.9;
  &:hover {
    opacity: 1;
    box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
`;

const Icon = styled.i`
  padding: 0px 5px 2px 0px;
  border-bottom: 2px solid #0ca5b3;
  margin-left: 18%;
  // margin-right: 5px;
  color: #0ca5b3;
`;
const Title = styled.p`
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: 600;
  font-size: 3rem;
  color: #0ca5b3;
  padding: 20px 0px 20px 0px;
`;

const Form = styled.form`
  width: 400px;
  height: 280px;
  margin-top: 50px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.2);
`;
const Input_container = styled.div`
  padding: 0 0 10px 0;
`;
const Form_container = styled.div``;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isLogin: false,
    };
    this.handle = this.handle.bind(this);
    this.submit = this.submit.bind(this);
  }

  handle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  submit = async (event) => {
    event.preventDefault();

    await axios
      .post("http://localhost:5000/login", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("msv", res.data.username);
        sessionStorage.setItem("lop", res.data.lop);
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });

    this.setState({
      isLogin: localStorage.getItem("accessToken") != null,
    });
  };

  render() {
    if (this.state.isLogin === true) {
      return <Redirect to="/home" />;
    } else {
      return (
        <Body>
          <Container>
            <Title>
              <br />
              HỆ THỐNG QUẢN LÝ
              <br />
              TRƯỜNG CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
            </Title>
            <Form_container>
              <Form action="" method="post" onSubmit={this.submit}>
                <Title>ĐĂNG NHẬP</Title>
                <Input_container>
                  <Icon>
                    <FaUser />
                  </Icon>
                  <_Input
                    type="text"
                    required
                    name="username"
                    placeholder="Email đăng nhập"
                    value={this.state.username}
                    onChange={this.handle}
                    autoFocus
                  />
                </Input_container>
                <br />
                <Input_container>
                  <Icon>
                    <RiLockPasswordFill />
                  </Icon>
                  <_Input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    // value={this.state.password}

                    onChange={this.handle}
                  ></_Input>
                </Input_container>
                <br />
                {/* <Title1>Quên mật khẩu?</Title1> */}
                <_Button onClick={this.submit}>Đăng nhập</_Button>
                <br />
              </Form>
            </Form_container>
          </Container>
        </Body>
      );
    }
  }
}

export default Login;
