import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './Home.css'

function buildHomeFilterTags({ selectedBorrowDate, selectedReturnDate, selectedLocation, selectedAgeGroup, selectedPriceRange, formatDateLabel, priceRangeOptions }) {
	const tags = []

	if (selectedBorrowDate) {
		tags.push(`Mượn: ${formatDateLabel(selectedBorrowDate)}`)
	}

	if (selectedReturnDate) {
		tags.push(`Trả: ${formatDateLabel(selectedReturnDate)}`)
	}

	if (selectedLocation !== 'all') {
		tags.push(`Khu vực: ${selectedLocation}`)
	}

	if (selectedAgeGroup !== 'all') {
		tags.push(`Độ tuổi: ${selectedAgeGroup}`)
	}

	if (selectedPriceRange !== 'all') {
		tags.push(`Giá: ${priceRangeOptions.find((option) => option.key === selectedPriceRange)?.label || ''}`)
	}

	return tags
}

function Home() {
	const navigate = useNavigate()
	const bannerSlides = [
		{
			id: 1,
			tag: 'Cho thuê nổi bật',
			title: 'ToyZone - Dịch vụ cho thuê đồ chơi linh hoạt',
			description: 'Thuê đồ chơi theo tuần hoặc theo tháng, tiết kiệm chi phí và luôn có đồ chơi mới cho bé.',
			buttonText: 'Thuê ngay',
			image: 'https://cdn-icons-png.flaticon.com/512/3468/3468379.png',
			alt: 'Gấu bông',
		},
		{
			id: 2,
			tag: 'Đặt lịch nhanh',
			title: 'Đồ chơi giáo dục cho bé mượn theo gói',
			description: 'Chọn gói thuê phù hợp theo độ tuổi để bé học hỏi mỗi ngày mà không tốn nhiều chi phí.',
			buttonText: 'Đặt lịch mượn',
			image: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png',
			alt: 'Đồ chơi trí tuệ',
		},
		{
			id: 3,
			tag: 'Đổi đồ chơi định kỳ',
			title: 'Mượn đồ chơi vận động và đổi mẫu hằng tuần',
			description: 'Bé luôn có trải nghiệm mới với chính sách đổi đồ chơi định kỳ, vệ sinh an toàn trước khi giao.',
			buttonText: 'Xem gói thuê',
			image: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
			alt: 'Xe và máy bay đồ chơi',
		},
	]

	const categories = [
		{
			id: 0,
			key: 'all',
			name: 'Tất cả',
			icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png',
		},
		{
			id: 1,
			key: 'card-games',
			name: 'Trò chơi thẻ',
			icon: 'https://cdn-icons-png.flaticon.com/512/2431/2431978.png',
		},
		{
			id: 2,
			key: 'puzzles',
			name: 'Xếp hình',
			icon: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png',
		},
		{
			id: 3,
			key: 'construction',
			name: 'Lắp ráp',
			icon: 'https://cdn-icons-png.flaticon.com/512/1867/1867934.png',
		},
		{
			id: 4,
			key: 'airplane',
			name: 'Máy bay',
			icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
		},
		{
			id: 5,
			key: 'doll',
			name: 'Búp bê',
			icon: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
		},
		{
			id: 6,
			key: 'ball',
			name: 'Bóng',
			icon: 'https://cdn-icons-png.flaticon.com/512/861/861512.png',
		},
		{
			id: 7,
			key: 'car',
			name: 'Ô tô',
			icon: 'https://cdn-icons-png.flaticon.com/512/2554/2554936.png',
		},
	]

	const [currentSlide, setCurrentSlide] = useState(0)
	const [searchKeyword, setSearchKeyword] = useState('')
	const [selectedBorrowDate, setSelectedBorrowDate] = useState('')
	const [selectedReturnDate, setSelectedReturnDate] = useState('')
	const [selectedLocation, setSelectedLocation] = useState('all')
	const [selectedAgeGroup, setSelectedAgeGroup] = useState('all')
	const [selectedPriceRange, setSelectedPriceRange] = useState('all')
	const totalSlides = bannerSlides.length
	const locationOptions = ['all', 'Quận 1', 'Quận 3', 'Thủ Đức', 'Bình Thạnh', 'Quận 7', 'Gò Vấp', 'Phú Nhuận']
	const ageGroupOptions = ['all', '1-3 tuổi', '2-5 tuổi', '3-7 tuổi', '4-8 tuổi', '5-10 tuổi', '6-12 tuổi']
	const priceRangeOptions = [
		{ key: 'all', label: 'Tất cả mức giá' },
		{ key: 'under-60000', label: 'Dưới 60.000đ/tuần' },
		{ key: '60000-80000', label: '60.000đ - 80.000đ/tuần' },
		{ key: 'over-80000', label: 'Trên 80.000đ/tuần' },
	]
	const isInvalidDateRange = Boolean(
		selectedBorrowDate && selectedReturnDate && selectedReturnDate < selectedBorrowDate
	)

	useEffect(() => {
		const autoSlideTimer = setInterval(() => {
			setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
		}, 5000)

		return () => clearInterval(autoSlideTimer)
	}, [totalSlides])

	const handlePrevSlide = () => {
		setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
	}

	const handleNextSlide = () => {
		setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
	}

	const handleBorrowDateChange = (value) => {
		setSelectedBorrowDate(value)

		if (selectedReturnDate && value && selectedReturnDate < value) {
			setSelectedReturnDate('')
		}
	}

	const formatDateLabel = (value) => {
		if (!value) return ''

		const [year, month, day] = value.split('-')
		return `${day}/${month}/${year}`
	}

	const navigateToToyList = ({ category = '', search = '' } = {}) => {
		const query = new URLSearchParams()

		if (category && category !== 'all') {
			query.set('category', category)
		}

		if (search.trim()) {
			query.set('search', search.trim())
		}

		if (selectedBorrowDate) {
			query.set('borrowDate', selectedBorrowDate)
		}

		if (selectedReturnDate) {
			query.set('returnDate', selectedReturnDate)
		}

		if (selectedLocation !== 'all') {
			query.set('location', selectedLocation)
		}

		if (selectedAgeGroup !== 'all') {
			query.set('ageGroup', selectedAgeGroup)
		}

		if (selectedPriceRange !== 'all') {
			query.set('priceRange', selectedPriceRange)
		}

		const queryString = query.toString()
		const destination = queryString ? `/toys?${queryString}` : '/toys'

		navigate(destination)
	}

	const handleApplyFilters = (event) => {
		event.preventDefault()

		if (isInvalidDateRange) {
			return
		}

		navigateToToyList({ search: searchKeyword })
	}

	const handleResetFilters = () => {
		setSelectedBorrowDate('')
		setSelectedReturnDate('')
		setSelectedLocation('all')
		setSelectedAgeGroup('all')
		setSelectedPriceRange('all')
	}

	const handleCategorySelect = (categoryKey) => {
		navigateToToyList({ category: categoryKey, search: searchKeyword })
	}

	const handleSearch = (event) => {
		event.preventDefault()
		navigateToToyList({ search: searchKeyword })
	}

	const activeFilterTags = buildHomeFilterTags({
		selectedBorrowDate,
		selectedReturnDate,
		selectedLocation,
		selectedAgeGroup,
		selectedPriceRange,
		formatDateLabel,
		priceRangeOptions,
	})

	return (
		<div className="home-page">
			<div className="container-fluid home-shell px-0">
				<Header
					categories={categories}
					activeCategory="all"
					onCategorySelect={handleCategorySelect}
				/>

				<section className="hero-section px-3 px-lg-4">
					<button
						type="button"
						className="hero-nav-btn hero-nav-btn-prev"
						onClick={handlePrevSlide}
						aria-label="Banner trước"
					>
						<FiChevronLeft />
					</button>
					<button
						type="button"
						className="hero-nav-btn hero-nav-btn-next"
						onClick={handleNextSlide}
						aria-label="Banner sau"
					>
						<FiChevronRight />
					</button>

					<div className="hero-slider-viewport">
						<div
							className="hero-slider-track"
							style={{ transform: `translateX(-${currentSlide * 100}%)` }}
						>
							{bannerSlides.map((slide, index) => (
								<div
									className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
									key={slide.id}
								>
									<div className="row align-items-center g-4 g-lg-0">
										<div className="col-12 col-lg-6 text-center text-lg-start">
											<span className="hero-tag">{slide.tag}</span>
											<h2 className="hero-title mt-3">{slide.title}</h2>
											<p className="hero-text mb-4">{slide.description}</p>
											<Link to="/toys" className="btn hero-shop-btn">{slide.buttonText}</Link>
										</div>

										<div className="col-12 col-lg-6 text-center">
											<div className="hero-image-wrap mx-auto">
												<img
													src={slide.image}
													alt={slide.alt}
													className="img-fluid hero-image"
												/>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="slider-dots text-center pb-3">
						{bannerSlides.map((slide, index) => (
							<button
								type="button"
								key={slide.id}
								className={`dot ${index === currentSlide ? 'active' : ''}`}
								onClick={() => setCurrentSlide(index)}
								aria-label={`Chuyển tới banner ${index + 1}`}
							/>
						))}
					</div>
				</section>

				{/* <section className="category-section px-3 px-lg-4 py-5 pt-lg-4">
					<div className="home-filter-panel mb-4 mb-lg-5">
						<div className="home-filter-head mb-4">
							<div>
								<h3 className="home-filter-title mb-2">Bộ lọc nhanh</h3>
							</div>
						</div>

						<form className="home-filter-form" onSubmit={handleApplyFilters}>
							<div className="home-filter-fields-wrap">
								<div className="row g-3">
									<div className="col-12 col-md-6 col-lg-4">
										<label className="home-filter-label" htmlFor="borrow-date">Ngày mượn</label>
										<input
											id="borrow-date"
											type="date"
											className="home-filter-control"
											value={selectedBorrowDate}
											onChange={(event) => handleBorrowDateChange(event.target.value)}
										/>
									</div>

									<div className="col-12 col-md-6 col-lg-4">
										<label className="home-filter-label" htmlFor="return-date">Ngày trả</label>
										<input
											id="return-date"
											type="date"
											className="home-filter-control"
											value={selectedReturnDate}
											onChange={(event) => setSelectedReturnDate(event.target.value)}
											min={selectedBorrowDate || undefined}
											disabled={!selectedBorrowDate}
										/>
									</div>

									<div className="col-12 col-md-6 col-lg-4">
										<label className="home-filter-label" htmlFor="pickup-location">Vị trí</label>
										<select
											id="pickup-location"
											className="home-filter-control"
											value={selectedLocation}
											onChange={(event) => setSelectedLocation(event.target.value)}
										>
											<option value="all">Tất cả khu vực</option>
											{locationOptions.slice(1).map((location) => (
												<option key={location} value={location}>{location}</option>
											))}
										</select>
									</div>

									<div className="col-12 col-md-6 col-lg-4">
										<label className="home-filter-label" htmlFor="age-group">Độ tuổi</label>
										<select
											id="age-group"
											className="home-filter-control"
											value={selectedAgeGroup}
											onChange={(event) => setSelectedAgeGroup(event.target.value)}
										>
											<option value="all">Tất cả độ tuổi</option>
											{ageGroupOptions.slice(1).map((ageGroup) => (
												<option key={ageGroup} value={ageGroup}>{ageGroup}</option>
											))}
										</select>
									</div>

									<div className="col-12 col-md-6 col-lg-4">
										<label className="home-filter-label" htmlFor="price-range">Mức giá</label>
										<select
											id="price-range"
											className="home-filter-control"
											value={selectedPriceRange}
											onChange={(event) => setSelectedPriceRange(event.target.value)}
										>
											{priceRangeOptions.map((option) => (
												<option key={option.key} value={option.key}>{option.label}</option>
											))}
										</select>
									</div>
								</div>
							</div>

							<div className="home-filter-footer mt-3">
								<div className="home-filter-chip-list">
									{activeFilterTags.length > 0 ? (
										activeFilterTags.map((tag) => (
											<span className="home-filter-chip" key={tag}>{tag}</span>
										))
									) : (
										<p className="home-filter-note mb-0">
											{isInvalidDateRange
												? 'Ngày trả phải sau hoặc bằng ngày mượn trước khi áp dụng bộ lọc.'
												: 'Điền bộ lọc rồi bấm Lọc đồ chơi để xem kết quả ở trang cửa hàng.'}
										</p>
									)}
								</div>

								<div className="home-filter-actions">
									<button type="button" className="home-filter-reset" onClick={handleResetFilters}>
										Xóa bộ lọc
									</button>
									<button type="submit" className="home-filter-apply" disabled={isInvalidDateRange}>
										Lọc đồ chơi
									</button>
								</div>
							</div>
						</form>
					</div>

					<h3 className="section-title text-center mb-2">Mượn theo danh mục</h3>
					<p className="section-subtext text-center mb-4">
						Chọn danh mục hoặc nhập từ khóa tìm kiếm ở đầu trang, hệ thống sẽ chuyển sang cửa hàng để hiển thị sản phẩm tương ứng.
					</p>
					<div className="row g-3 g-lg-4 justify-content-center">
						{categories.filter((category) => category.key !== 'all').map((category) => (
							<div className="col-6 col-sm-4 col-md-3 col-lg category-col" key={category.id}>
								<button
									type="button"
									className="category-card h-100 d-flex flex-column align-items-center justify-content-center"
									onClick={() => handleCategorySelect(category.key)}
									aria-label={`Xem đồ chơi danh mục ${category.name}`}
								>
									<img src={category.icon} alt={category.name} className="category-icon" />
									<p className="mb-0 mt-2 category-name">{category.name}</p>
								</button>
							</div>
						))}
					</div>
				</section> */}

				<Footer />
			</div>
		</div>
	)
}

export default Home