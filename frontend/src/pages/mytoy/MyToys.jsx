import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import "./MyToys.css";
import { showSuccess, showConfirm } from "@/components/alert";

import {
  getMyToys,
  createToy,
  deleteToy,
  editToy,
} from "@/services/toyService";
import { uploadImage } from "@/services/uploadImageService";

function MyToys() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toys, setToys] = useState([]);
  const token = localStorage.getItem("token");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingToyId, setEditingToyId] = useState(null);
  const [status, setStatus] = useState("");
  const [newToy, setNewToy] = useState({
    name: "",
    category: "",
    price: "",
    deposit: "",
    description: "",
  });

  // Load toys khi vào trang
  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    try {
      const res = await getMyToys(token);
      setToys(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingToyId(null);
    setNewToy({
      name: "",
      category: "",
      price: "",
      deposit: "",
      description: "",
    });
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewToy({
      ...newToy,
      [name]: value,
    });
  };

  // Đăng đồ chơi
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = previewImage;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const toyData = {
        ...newToy,
        status: "available",
        image: imageUrl,
      };

      if (editingToyId) {
        const res = await editToy(editingToyId, toyData, token);

        setToys(toys.map((toy) => (toy._id === editingToyId ? res.data : toy)));

        showSuccess("Cập nhật đồ chơi thành công!");
      } else {
        const res = await createToy(toyData, token);

        setToys([res.data, ...toys]);

        showSuccess("Đăng đồ chơi thành công!");
      }

      handleCloseModal();
      setEditingToyId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Xóa đồ chơi
  const handleDelete = async (id) => {
    const confirm = await showConfirm(
      "Xóa đồ chơi",
      "Bạn có chắc chắn muốn xóa đồ chơi này không?",
    );

    if (confirm) {
      try {
        await deleteToy(id, token);

        setToys(toys.filter((toy) => toy._id !== id));

        showSuccess("Đã xóa đồ chơi thành công");
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleEditToy = (toy) => {
    setEditingToyId(toy._id);

    setNewToy({
      name: toy.name,
      category: toy.category,
      price: toy.price,
      description: toy.description,
      deposit: toy.deposit,
    });

    setPreviewImage(toy.image);
    setIsModalOpen(true);
  };
  return (
    <div className="my-toys-page">
      <Header />

      <div className="my-toys-container">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Kho đồ chơi của tôi</h1>
            <p className="text-muted mt-1 mb-0">
              Quản lý các món đồ chơi bạn đang cho thuê trên ToyZone
            </p>
          </div>

          <button
            className="btn btn-add-toy"
            onClick={() => {
              setStatus("adding");
              handleOpenModal();
            }}
          >
            <FiPlus size={20} />
            Đăng đồ chơi mới
          </button>
        </div>

        <div className="toys-grid">
          {toys.map((toy) => (
            <div className="toy-card-item" key={toy._id}>
              <div className="toy-image-wrapper">
                <img
                  src={
                    toy.image ||
                    "https://cdn-icons-png.flaticon.com/512/4523/4523868.png"
                  }
                  alt={toy.name}
                />
              </div>

              <div className="toy-content-row">
                <div className="toy-info-group">
                  <span className="toy-category-badge">{toy.category}</span>
                  <h3 className="toy-name">{toy.name}</h3>
                </div>

                <div className="toy-status-col ps-3">
                  <span
                    className={`status-pill ${
                      toy.status === "available"
                        ? "status-available"
                        : "status-rented"
                    }`}
                  >
                    {toy.status === "available"
                      ? "Sẵn sàng cho thuê"
                      : "Đang cho thuê"}
                  </span>
                </div>

                <div className="toy-price-col">
                  <span className="price-label">Giá thuê/tuần</span>
                  <span className="price-value">
                    {new Intl.NumberFormat("vi-VN").format(toy.price)} ₫
                  </span>
                </div>
                <div className="toy-price-col">
                  <span className="price-label">Tiền cọc</span>
                  <span className="price-value">
                    {new Intl.NumberFormat("vi-VN").format(toy.deposit)} ₫
                  </span>
                </div>

                <div className="toy-actions-col">
                  <button
                    className="btn-icon-action"
                    title="Chỉnh sửa"
                    onClick={() => {
                      setStatus("editing");
                      handleEditToy(toy);
                    }}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    className="btn-icon-action delete"
                    title="Xóa"
                    onClick={() => handleDelete(toy._id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-custom animate-slide-in">
            <div className="modal-header">
              <h2 className="modal-title">
                {status === "editing"
                  ? "Chỉnh sửa đồ chơi"
                  : "Đăng đồ chơi mới"}
              </h2>
              <button className="btn-close-modal" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Tên đồ chơi</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nhập tên đồ chơi"
                    value={newToy.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Danh mục</label>

                    <input
                      type="text"
                      name="category"
                      className="form-control"
                      placeholder="Nhập loại đồ chơi (ví dụ: Lego, Xe đồ chơi...)"
                      value={newToy.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Giá thuê/Tuần </label>

                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="0"
                      value={newToy.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tiền cọc</label>

                    <input
                      type="number"
                      name="deposit"
                      className="form-control"
                      placeholder="0"
                      value={newToy.deposit}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Mô tả</label>

                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={newToy.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Hình ảnh</label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {previewImage && (
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={previewImage}
                        alt="preview"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #ddd",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#ff5f93",
                    borderColor: "#ff5f93",
                  }}
                >
                  Đăng ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MyToys;
