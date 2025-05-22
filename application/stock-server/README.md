**Project: SSI Data Proxy Service**

This service provides a set of Express.js routes to proxy requests to the SSI market data API using the `ssi-fcdata` client library.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Request Example](#request-example)
- [API Endpoints](#api-endpoints)
  - [DailyStockPrice](#dailystockprice)
  - [IndexComponents](#indexcomponents)
  - [IndexList](#indexlist)
  - [DailyIndex](#dailyindex)
  - [Securities](#securities)
  - [SecuritiesDetails](#securitiesdetails)
  - [DailyOhlc](#dailyohlc)
  - [IntradayOhlc](#intradayohlc)
- [Error Handling](#error-handling)
- [License](#license)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/loveCiForever/athStock
   cd applications/stock-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the project root with the following variables:

   ```ini
    PORT=3000

    DB_HOST=quanghuydeptrai
    DB_USER=quanghuydeptrai
    DB_PASSWORD=quanghuydeptrai
    DB_NAME=quanghuydeptrai
    PORT=3000

    SSI_ConsumerId=quanghuydeptrai
    SSI_ConsumerSecret=quanghuydeptrai
   ```


4. **Start the server**

   ```bash
   npx nodemon app.js
   ```

   By default, the server will listen on port 3000. You can override this by setting `PORT` in `.env`.

---

## Configuration

All routes are mounted under the `/ssi` base path. In your main Express app, register the router:

```js
import express from 'express';
import ssiRouter from './routes/ssiRoutes.js';

const app = express();
app.use(express.json());
app.use('/ssi', ssiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

The module `ssiConfig()` reads `SSI_API_URL` from environment variables and supplies it to each route.

---

## Usage

All endpoints accept **POST** requests with a JSON body. Responses return the JSON data received from the SSI API.

### Request Example

```http
POST /ssi/DailyStockPrice
Content-Type: application/json

{
  "symbol": "ACB",
  "market": "HOSE",
  "fromDate": "01/12/2021",
  "toDate": "17/12/2021",
  "pageIndex": 1,
  "pageSize": 1000
}
```

---

## API Endpoints

### DailyStockPrice

* **Route:** `POST /ssi/DailyStockPrice`
* **Description:** Retrieve daily stock price data for a given symbol and market.
* **Body Parameters:**

  | Name      | Type   | Default        | Description                |
  | --------- | ------ | -------------- | -------------------------- |
  | symbol    | String | `"ACB"`        | Stock symbol               |
  | market    | String | `"HOSE"`       | Stock exchange code        |
  | fromDate  | String | `"DD/MM/YYYY"` | Start date (dd/mm/yyyy)    |
  | toDate    | String | `"DD/MM/YYYY"` | End date (dd/mm/yyyy)      |
  | pageIndex | Number | `1`            | Page index for pagination  |
  | pageSize  | Number | `1000`         | Number of records per page |

---

### IndexComponents

* **Route:** `POST /ssi/IndexComponents`
* **Description:** Get the components (constituent stocks) of an index.
* **Body Parameters:**

  | Name      | Type   | Default | Description                    |
  | --------- | ------ | ------- | ------------------------------ |
  | indexCode | String | `""`    | Code of the index (e.g., VN30) |
  | pageIndex | Number | `4`     | Page index                     |
  | pageSize  | Number | `100`   | Number of items per page       |

---

### IndexList

* **Route:** `POST /ssi/IndexList`
* **Description:** List available indices for a given exchange.
* **Body Parameters:**

  | Name      | Type   | Default | Description                     |
  | --------- | ------ | ------- | ------------------------------- |
  | exchange  | String | `""`    | Exchange code (e.g., HOSE, HNX) |
  | pageIndex | Number | `4`     | Page index                      |
  | pageSize  | Number | `100`   | Number of items per page        |

---

### DailyIndex

* **Route:** `POST /ssi/DailyIndex`
* **Description:** Fetch daily index values for a specific index.
* **Body Parameters:**

  | Name      | Type    | Default        | Description                 |
  | --------- | ------- | -------------- | --------------------------- |
  | indexId   | String  | `"HNX30"`      | Index identifier            |
  | fromDate  | String  | `"DD/MM/YYYY"` | Start date                  |
  | toDate    | String  | `"DD/MM/YYYY"` | End date                    |
  | pageIndex | Number  | `1`            | Page index                  |
  | pageSize  | Number  | `1000`         | Number of records           |
  | ascending | Boolean | `true`         | Sort order (true=ascending) |

---

### Securities

* **Route:** `POST /ssi/Securities`
* **Description:** List all securities on a given market.
* **Body Parameters:**

  | Name      | Type   | Default  | Description              |
  | --------- | ------ | -------- | ------------------------ |
  | market    | String | `"HOSE"` | Stock exchange code      |
  | pageIndex | Number | `4`      | Page index               |
  | pageSize  | Number | `100`    | Number of items per page |

---

### SecuritiesDetails

* **Route:** `POST /ssi/SecuritiesDetails`
* **Description:** Retrieve detailed information for a specific security.
* **Body Parameters:**

  | Name      | Type   | Default  | Description              |
  | --------- | ------ | -------- | ------------------------ |
  | market    | String | `"HOSE"` | Stock exchange code      |
  | symbol    | String | `"ACB"`  | Stock symbol             |
  | pageIndex | Number | `4`      | Page index               |
  | pageSize  | Number | `100`    | Number of items per page |

---

### DailyOhlc

* **Route:** `POST /ssi/DailyOhlc`
* **Description:** Get daily OHLC (Open-High-Low-Close) data for a symbol.
* **Body Parameters:**

  | Name      | Type    | Default        | Description       |
  | --------- | ------- | -------------- | ----------------- |
  | symbol    | String  | `"ACB"`        | Stock symbol      |
  | fromDate  | String  | `"DD/MM/YYYY"` | Start date        |
  | toDate    | String  | `"DD/MM/YYYY"` | End date          |
  | pageIndex | Number  | `1`            | Page index        |
  | pageSize  | Number  | `100`          | Number of records |
  | ascending | Boolean | `true`         | Sort order        |

---

### IntradayOhlc

* **Route:** `POST /ssi/IntradayOhlc`
* **Description:** Fetch intraday OHLC data for a symbol.
* **Body Parameters:**

  | Name      | Type    | Default        | Description       |
  | --------- | ------- | -------------- | ----------------- |
  | symbol    | String  | `"ACB"`        | Stock symbol      |
  | fromDate  | String  | `"DD/MM/YYYY"` | Start date        |
  | toDate    | String  | `"DD/MM/YYYY"` | End date          |
  | pageIndex | Number  | `1`            | Page index        |
  | pageSize  | Number  | `100`          | Number of records |
  | ascending | Boolean | `true`         | Sort order        |

---

## Error Handling

All routes log errors to the console and return `500 Internal Server Error` by default. Some routes propagate status codes from SSI API responses when available.

---

## License

MIT © Victor Nguyen
