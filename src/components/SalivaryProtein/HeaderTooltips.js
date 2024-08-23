export const expertOpinionHTML = `
  <div style="width: 100%; box-sizing: border-box">
    <div
      style="
      border-radius: 10px 10px 0 0;
      background-color: #b0b0b0;
      border: hidden;
      padding: 10px;
    "
    >
      <div style="color: #424242; text-align: center; font-weight: bold">
        Expert Opinion
      </div>
    </div>
    <div
      style="
      padding: 10px;
      border: 1px solid #757575;
      border-radius: 4px;
      background-color: #e0e0e0;
    "
    >
      <table
        aria-label="simple table"
        style="width: 100%; border-collapse: collapse"
      >
        <tbody>
          <tr>
            <td
              style="
              font-weight: bold;
              word-break: break-word;
              padding: 8px;
              border-bottom: 1px solid #757575;
              border-right: 1px solid #757575;
              color: #212121;
            "
            >
              Acronym
            </td>
            <td
              style="
              font-weight: bold;
              padding: 8px;
              border-bottom: 1px solid #757575;
              color: #212121;
            "
            >
              Definition
            </td>
          </tr>
          <tr>
            <td
              style="
              padding-right: 5px;
              padding: 8px;
              border-bottom: 1px solid #757575;
              border-right: 1px solid #757575;
              color: #424242;
            "
            >
              US
            </td>
            <td
              style="
              padding-right: 5px;
              padding: 8px;
              border-bottom: 1px solid #757575;
              color: #424242;
            "
            >
              Unsubstantiated
            </td>
          </tr>
          <tr>
            <td
              style="
              padding-right: 5px;
              padding: 8px;
              border-bottom: none;
              border-right: 1px solid #757575;
              color: #424242;
            "
            >
              C
            </td>
            <td
              style="
              padding-right: 5px;
              padding: 8px;
              border-bottom: none;
              color: #424242;
            "
            >
              Confirmed
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

export const MSHTML = `
  <div style="width: 100%; box-sizing: border-box;">
    <div
      style="
                border-radius: 10px 10px 0 0;
                background-color: #b0b0b0;
                border: hidden;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                color: #424242;
              "
    >
      Abundance Indicator
    </div>
    <div
      style="
                padding: 10px;
                border: 1px solid #757575;
                border-radius: 4px;
                background-color: #e0e0e0;
              "
    >
      <table
        aria-label="simple table"
        style="width: 100%; border-collapse: collapse;"
      >
        <tbody>
          <tr>
            <td
              style="
                        font-weight: bold;
                        word-break: break-word;
                        padding: 8px;
                        border-bottom: 1px solid #757575;
                        border-right: 1px solid #757575;
                        color: #212121;
                      "
            >
              Saliva-based
            </td>
            <td
              style="
                        font-weight: bold;
                        padding: 8px;
                        border-bottom: 1px solid #757575;
                        border-right: 1px solid #757575;
                        color: #212121;
                      "
            >
              Blood-based
            </td>
            <td
              style="
                        font-weight: bold;
                        padding: 8px;
                        border-bottom: 1px solid #757575;
                        border-right: 1px solid #757575;
                        color: #212121;
                      "
            >
              Estimated Abundance
            </td>
            <td
              style="
                        font-weight: bold;
                        padding: 8px;
                        border-bottom: 1px solid #757575;
                        color: #212121;
                      "
            >
              Units
            </td>
          </tr>
          <tr>
            <td
              rowspan="3"
              style="padding: 8px; border-bottom: 1px solid #757575; border-right: 1px solid #757575;"
            >
              <svg width="18" height="120">
                <defs>
                  <linearGradient
                    id="greenGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: rgb(0, 100, 0); stop-opacity: 1;"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: rgb(200, 250, 200); stop-opacity: 1;"
                    />
                  </linearGradient>
                </defs>
                <rect width="18" height="120" fill="url(#greenGradient)">
                  <title>High</title>
                </rect>
              </svg>
            </td>
            <td
              rowspan="3"
              style="padding: 8px; border-bottom: 1px solid #757575; border-right: 1px solid #757575;"
            >
              <svg width="18" height="120">
                <defs>
                  <linearGradient
                    id="redGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: rgb(150, 0, 0); stop-opacity: 1;"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: rgb(255, 200, 200); stop-opacity: 1;"
                    />
                  </linearGradient>
                </defs>
                <rect width="18" height="120" fill="url(#redGradient)">
                  <title>High</title>
                </rect>
              </svg>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              High
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              obs
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              Medium
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              obs
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: none; color: #424242;">
              Low
            </td>
            <td style="padding: 8px; border-bottom: none; color: #424242;">
              obs
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #757575; border-right: 1px solid #757575;">
              <svg width="18" height="18">
                <rect width="18" height="18" fill="rgb(255, 255, 255)">
                  <title>Not Detected</title>
                </rect>
              </svg>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; border-right: 1px solid #757575;">
              <svg width="18" height="18">
                <rect width="18" height="18" fill="rgb(255, 255, 255)">
                  <title>Not Detected</title>
                </rect>
              </svg>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              ND (Not Detected)
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #757575; color: #424242;">
              na
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: none; border-right: 1px solid #757575;">
              <svg width="18" height="18">
                <rect width="18" height="18" fill="rgb(255, 255, 255)">
                  <title>Not Available</title>
                </rect>
              </svg>
            </td>
            <td style="padding: 8px; border-bottom: none; border-right: 1px solid #757575;">
              <svg width="18" height="18">
                <rect width="18" height="18" fill="rgb(255, 255, 255)">
                  <title>Not Available</title>
                </rect>
              </svg>
            </td>
            <td style="padding: 8px; border-bottom: none; color: #424242;">
              NA (Not Available)
            </td>
            <td style="padding: 8px; border-bottom: none; color: #424242;">
              na
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;
