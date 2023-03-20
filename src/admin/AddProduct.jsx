import React from "react";
import { Col, Container, Row, Button, Form, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Divide from "../components/UI/Divide";
import categoryData from "../assets/data/category";
import { useState } from "react";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import Helmet from "../components/Helmet/Helmet";
import {
  firebaseFirestore,
  firebaseStorage,
} from "../database/InstanceFiresbase";
import { async } from "@firebase/util";

function AddProduct() {
  const categories = categoryData;
  const [enterTilte, setEnterTitle] = useState("");
  const [enterShortDecs, setEnterShortDecs] = useState("");
  const [enterDecs, setEnterDecs] = useState("");
  const [enterCategory, setEnterCategory] = useState(
    categories[0].categoryName
  );
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const AddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await collection(firebaseFirestore, "products");

      const stogareRef = ref(
        firebaseStorage,
        `productImages/${Date.now() + enterProductImg.name}`
      );
      const uploadTask = uploadBytesResumable(stogareRef, enterProductImg);
      uploadTask.on(
        () => {
          toast.error("Lưu ảnh thất bại");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(docRef, {
              productName: enterTilte,
              imgThumb: downloadURL,
              category: enterCategory,
              price: enterPrice,
              isTrending: false,
              shortDesc: enterShortDecs,
              description: enterDecs,
              reviews: [
                {
                  name: "Mina",
                  rating: 5,
                  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                },
              ],
              avgRating: 5,
            });
          });
        }
      );
      setLoading(false);
      toast.success("Thêm sản phẩm thành công ");
      navigate("/dashboard/all-products");
    } catch (error) {
      setLoading(false);
      toast.error("Thêm sản phẩm thất bại");
    }
  };

  return (
    <Helmet title={"Thêm sản phẩm"}>
      <section className="my-3">
        <Container fluid>
          <Row>
            <Col xs="auto">
              <Breadcrumb>
                <Breadcrumb.Item href="all-products">
                  Quản lý sản phẩm
                </Breadcrumb.Item>
                <Breadcrumb.Item active aria-current="page">
                  Thêm sản phẩm
                </Breadcrumb.Item>
              </Breadcrumb>
              <Divide />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="my-5">
        <Container>
          <Row>
            <Col>
              {loading ? (
                <h4>Loading....</h4>
              ) : (
                <Form onSubmit={AddProduct}>
                  <Form.Group className="my-3" controlId="formBasicEmail">
                    <Form.Label>Tên sản phẩm</Form.Label>

                    <Form.Control
                      placeholder=""
                      value={enterTilte}
                      onChange={(e) => setEnterTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Row className="my-3">
                    <Form.Group
                      as={Col}
                      className=""
                      controlId="formBasicEmail"
                    >
                      <Form.Label>Giá sản phẩm</Form.Label>

                      <Form.Control
                        type="number"
                        placeholder=""
                        value={enterPrice}
                        onChange={(e) => setEnterPrice(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      className=""
                      controlId="formBasicEmail"
                    >
                      <Form.Label>Loại sản phẩm</Form.Label>

                      <Form.Select
                        aria-label="Default select example"
                        value={enterCategory}
                        onChange={(e) => setEnterCategory(e.target.value)}
                        required
                      >
                        {categories.map((item, index) => (
                          <option
                            value={item.categoryName}
                            key={index}
                            className="text-capitalize"
                          >
                            {item.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Form.Group
                    className="my-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Mô tả ngắn</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={enterShortDecs}
                      onChange={(e) => setEnterShortDecs(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="my-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={enterDecs}
                      onChange={(e) => setEnterDecs(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} className="" controlId="formBasicEmail">
                    <Form.Label>Ảnh sản phẩm</Form.Label>

                    <Form.Control
                      type="file"
                      placeholder="Chọn ảnh"
                      accept=".jpg, .png"
                      onChange={(e) => setEnterProductImg(e.target.files[0])}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="opacity-100 mt-5"
                  >
                    Thêm
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default AddProduct;
