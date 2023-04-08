import React from "react";
import { Col, Container, Row, Breadcrumb, Table } from "react-bootstrap";
import Helmet from "../components/Helmet/Helmet";
import Divide from "../components/UI/Divide";
import UseGetData from "../database/UseGetData";
import { doc, deleteDoc } from "@firebase/firestore";
import { firebaseFirestore } from "../database/InstanceFiresbase";
import { toast } from "react-toastify";

function Users() {
  const { data: usersData, loading } = UseGetData("users");
  const deleteUser = async (id) => {
    await deleteDoc(doc(firebaseFirestore, "users", id));
    toast.success("Đã xóa người dùng");
  };
  return (
    <Helmet title={"Quản lý tài khoản"}>
      <section className="my-3">
        <Container fluid>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item active aria-current="page">
                  Quản lý tài khoản
                </Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="my-5">
        <Container fluid>
          <Row>
            <Col>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th className="text-center">Ảnh đại diện</th>
                    <th className="text-center">Chức vụ</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <h3>Loading....</h3>
                  ) : (
                    usersData.map((item, index) => (
                      <tr key={index} className="align-middle">
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td className="text-capitalize">{item.email}</td>

                        <td className="text-center">
                          <img
                            src={item.urlImg}
                            alt=""
                            className=""
                            height={"100px"}
                          />
                        </td>
                        <td className="text-center text-capitalize">
                          {item.role}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteUser(item.id);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Users;
