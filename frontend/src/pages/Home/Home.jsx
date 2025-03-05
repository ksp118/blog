import "./Home.css";
import ContentListDisplayer from "./components/ContentListDisplayer";

function Home() {
  return (
    <div className="container">
      <div className="main-screen">
        <div className="main-screen-content">
          <div className="main-textarea">
            <p className="main-name">Gyuho Lee</p>
            <p className="main-introduce">
              Lost in the middle of Electrical and Computer Engineering
            </p>
          </div>
          <img
            className="main-img"
            src="/img/main_img.jpg"
            alt="it's me"
          />
        </div>
      </div>
      <div className="content-area">
        <ContentListDisplayer contentName={"Main"} />
      </div>
    </div>
  );
}

export default Home;
