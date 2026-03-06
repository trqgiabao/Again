import './Footer.css';
import { Button, Input } from '../../atoms';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__section">
            <h4 className="footer__title">Get Help</h4>
            <ul className="footer__links">
              <li><a href="#">Order Status</a></li>
              <li><a href="#">Delivery</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Payment Options</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__title">About Nike</h4>
            <ul className="footer__links">
              <li><a href="#">News</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Sustainability</a></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__title">Join Us</h4>
            <ul className="footer__links">
              <li><a href="#">Nike App</a></li>
              <li><a href="#">Nike Run Club</a></li>
              <li><a href="#">Nike Training Club</a></li>
              <li><a href="#">SNKRS</a></li>
            </ul>
          </div>
          <div className="footer__section">
            <h4 className="footer__title">Newsletter</h4>
            <p className="footer__newsletter-text">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="footer__newsletter-form">
              <Input type="email" placeholder="Your email" />
              <Button variant="primary" size="small">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">© 2024 Nike, Inc. All Rights Reserved</p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
