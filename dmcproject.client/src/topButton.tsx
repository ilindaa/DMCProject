import Button from 'react-bootstrap/Button';

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function TopButton() {
    return (
      <div className="topButtonDiv">
            <Button variant="secondary" id="topButton" onClick={() => scrollToTop()}><img src="https://localhost:7035/wwwroot/Website/arrow_upward.svg"></img></Button>
      </div>
  );
}

export default TopButton;