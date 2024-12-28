import React from 'react';

function Banner() {
  return (
    <div id="banner" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundRepeat: 'no-repeat', backgroundSize: 'Auto' }}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        {/* Content of the first flex container */}
      </div>
      <div className="mt-4" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
        {/* <ul>
          <li style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', marginRight: '-2rem', height: "11vh", width: "19vw" }}>
            <img id="bannerIMGS" src="Shri Indramani Tripathy, IAS.png" alt="IAS" />
            <div className="mt-1 IMGtitle" style={{ color: 'white', lineHeight: 1 }}>
              <h5>Shri Indramani Tripathy, IAS</h5>
              <p>Director, ST</p>
            </div>
          </li>
        </ul>
        <ul>
          <li style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row',height: "11vh", width: "19vw", marginRight: '4rem'  }}>
            <div className="mt-1 IMGtitle" style={{ color: 'white', lineHeight: 1 }}>
              <h5>Smt. Roopa Roshan Sahoo, IAS</h5>
              <p>Commissioner-Cum-Secretary</p>
            </div>
            <img id="bannerIMGS" src="Smt. Roopa Roshan Sahoo, IAS.png" alt="IAS" />
          </li>
        </ul> */}
      </div>
    </div>
  );
}

export default Banner;
