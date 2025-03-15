import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Slide data with improved structure
  const slides = [
    {
      image: "/src/assets/home-loan.jpg",
      title: "Home Loans",
      description: "Finance your dream home with competitive rates and flexible terms",
      ctaText: "Explore Home Loans",
      ctaLink: "/loans/home"
    },
    {
      image: "/src/assets/car-loan.jpg",
      title: "Car Loans",
      description: "Get on the road with affordable vehicle financing options",
      ctaText: "Explore Car Loans",
      ctaLink: "/loans/car"
    },
    {
      image: "/src/assets/personal-loan.jpg",
      title: "Personal Loans",
      description: "Achieve your goals with personalized loan solutions",
      ctaText: "Explore Personal Loans",
      ctaLink: "/loans/personal"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-advance slides with improved timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Features data for better organization
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Competitive Rates",
      description: "Get the best interest rates in the market for all loan types",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Fast Approvals",
      description: "Quick application process with approvals in as little as 24 hours",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: "Expert Support",
      description: "Dedicated loan advisors to guide you through every step",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  // Footer links for better organization
  const footerLinks = {
    quickLinks: [
      { text: "About Us", href: "/about" },
      { text: "Services", href: "/services" },
      { text: "FAQ", href: "/faq" },
      { text: "Contact", href: "/contact" }
    ],
    legal: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar - Improved with mobile responsiveness */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/src/assets/logo.jpg" alt="Logo" className="h-10 w-auto mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Loan Assistance System</h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg 
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-300">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              Login
            </Link>
            <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Improved Slideshow */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Slideshow with improved transitions */}
            <div className="relative h-64 md:h-96">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent flex items-center">
                    <div className="text-white px-6 md:px-12 max-w-lg">
                      <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{slide.title}</h2>
                      <p className="text-sm md:text-lg mb-4 md:mb-6">{slide.description}</p>
                      <Link to={slide.ctaLink} className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Improved slide navigation */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
                {slides.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      index === currentSlide 
                        ? "bg-blue-600 scale-110" 
                        : "bg-white bg-opacity-50 hover:bg-opacity-75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Arrow navigation */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button 
                  onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-r-lg focus:outline-none ml-2"
                  aria-label="Previous slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                  onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-l-lg focus:outline-none mr-2"
                  aria-label="Next slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Features Section with improved layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-6 md:p-8 bg-gray-50">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`${feature.bgColor} ${feature.textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* Call to Action Section - New addition */}
            <div className="px-6 py-10 bg-blue-600 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="max-w-2xl mx-auto mb-6">Apply now and get a decision in minutes. Our team is ready to help you find the perfect loan solution.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/apply" className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-md">
                  Apply Now
                </Link>
                <Link to="/contact" className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>


{/* Testimonials Section - New addition */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Anil Ambani</h4>
                  <p className="text-sm text-gray-500">Home Loan Customer</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">"The loan process was incredibly smooth. I got pre-approved quickly and was able to make a confident offer on my dream home. Highly recommend!"</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Katrina Kaif</h4>
                  <p className="text-sm text-gray-500">Car Loan Customer</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">"The rates were better than any other lender I found. The staff was knowledgeable and helped me pick the right financing option for my new car."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Alia Bhat</h4>
                  <p className="text-sm text-gray-500">Personal Loan Customer</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">"I needed funds quickly for an unexpected expense. The fast approval process and flexible repayment options were exactly what I needed."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Improved Footer with better organization */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="/src/assets/logo.jpg" alt="Logo" className="h-10 w-auto mr-3 bg-white rounded p-1" />
                <h2 className="text-xl font-bold">Loan Assistance System</h2>
              </div>
              <p className="text-gray-300">Streamlined financial solutions for everyone</p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="hover:text-white transition-colors duration-300">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="hover:text-white transition-colors duration-300">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>468 Urban Vault,HSR Layout,Bengaluru,India </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>9849511111</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@loans24.com</span>
                </li>
              </ul>
            </div>
          </div>
          
         <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">&copy; {new Date().getFullYear()} Loans24. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;