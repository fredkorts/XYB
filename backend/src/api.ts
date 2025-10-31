import express, { type Request, type Response } from 'express';

type Currency = 'USD' | 'EUR' | 'GBP';

type Account = {
    accountNumber: string;
    balance: number;
    currency: Currency;
}

type Transaction = {
    id: string;
    accountNumber: string;
    amount: number;
    currency: Currency;
    type: 'topup' | 'payment';
    timestamp: string;
    description?: string;
}

type AccountResponse = {
    accountNumber: string;
    balance: number;
    currency: Currency;
}

type TransactionsResponse = {
    transactions: Transaction[];
    total: number;
    limit: number;
    offset: number;
}

type TopupRequest = {
    amount: number;
    description?: string;
}

type TopupResponse = {
    transaction: Transaction;
    newBalance: number;
}

// Server
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

// In-memory data storage
const account: Account = {
  accountNumber: 'ACC-2025-001',
  balance: 3575.00,
  currency: 'USD'
};

const transactions: Transaction[] = [
  {
    id: 'TXN-001',
    accountNumber: account.accountNumber,
    amount: 1000.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-01T10:00:00Z').toISOString(),
    description: 'Initial deposit'
  },
  {
    id: 'TXN-002',
    accountNumber: account.accountNumber,
    amount: 50.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-02T09:15:00Z').toISOString(),
    description: 'Coffee shop'
  },
  {
    id: 'TXN-003',
    accountNumber: account.accountNumber,
    amount: 200.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-03T11:30:00Z').toISOString(),
    description: 'Monthly allowance'
  },
  {
    id: 'TXN-004',
    accountNumber: account.accountNumber,
    amount: 75.50,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-04T14:20:00Z').toISOString(),
    description: 'Grocery store'
  },
  {
    id: 'TXN-005',
    accountNumber: account.accountNumber,
    amount: 500.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-05T08:00:00Z').toISOString(),
    description: 'Salary deposit'
  },
  {
    id: 'TXN-006',
    accountNumber: account.accountNumber,
    amount: 120.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-06T16:45:00Z').toISOString(),
    description: 'Restaurant dinner'
  },
  {
    id: 'TXN-007',
    accountNumber: account.accountNumber,
    amount: 30.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-07T10:10:00Z').toISOString(),
    description: 'Gas station'
  },
  {
    id: 'TXN-008',
    accountNumber: account.accountNumber,
    amount: 150.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-08T12:00:00Z').toISOString(),
    description: 'Refund'
  },
  {
    id: 'TXN-009',
    accountNumber: account.accountNumber,
    amount: 45.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-09T15:30:00Z').toISOString(),
    description: 'Online shopping'
  },
  {
    id: 'TXN-010',
    accountNumber: account.accountNumber,
    amount: 250.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-10T09:00:00Z').toISOString(),
    description: 'Bonus payment'
  },
  {
    id: 'TXN-011',
    accountNumber: account.accountNumber,
    amount: 80.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-11T13:20:00Z').toISOString(),
    description: 'Pharmacy'
  },
  {
    id: 'TXN-012',
    accountNumber: account.accountNumber,
    amount: 100.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-12T10:30:00Z').toISOString(),
    description: 'Gift received'
  },
  {
    id: 'TXN-013',
    accountNumber: account.accountNumber,
    amount: 60.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-13T14:45:00Z').toISOString(),
    description: 'Movie tickets'
  },
  {
    id: 'TXN-014',
    accountNumber: account.accountNumber,
    amount: 300.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-14T08:15:00Z').toISOString(),
    description: 'Freelance payment'
  },
  {
    id: 'TXN-015',
    accountNumber: account.accountNumber,
    amount: 95.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-15T11:00:00Z').toISOString(),
    description: 'Utilities bill'
  },
  {
    id: 'TXN-016',
    accountNumber: account.accountNumber,
    amount: 150.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-16T09:30:00Z').toISOString(),
    description: 'Cash deposit'
  },
  {
    id: 'TXN-017',
    accountNumber: account.accountNumber,
    amount: 40.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-17T16:20:00Z').toISOString(),
    description: 'Book store'
  },
  {
    id: 'TXN-018',
    accountNumber: account.accountNumber,
    amount: 200.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-18T10:00:00Z').toISOString(),
    description: 'Investment return'
  },
  {
    id: 'TXN-019',
    accountNumber: account.accountNumber,
    amount: 110.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-19T13:30:00Z').toISOString(),
    description: 'Gym membership'
  },
  {
    id: 'TXN-020',
    accountNumber: account.accountNumber,
    amount: 75.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-20T15:45:00Z').toISOString(),
    description: 'Pet supplies'
  },
  {
    id: 'TXN-021',
    accountNumber: account.accountNumber,
    amount: 400.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-21T08:00:00Z').toISOString(),
    description: 'Salary bonus'
  },
  {
    id: 'TXN-022',
    accountNumber: account.accountNumber,
    amount: 55.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-22T12:15:00Z').toISOString(),
    description: 'Taxi service'
  },
  {
    id: 'TXN-023',
    accountNumber: account.accountNumber,
    amount: 180.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-23T09:45:00Z').toISOString(),
    description: 'Cashback reward'
  },
  {
    id: 'TXN-024',
    accountNumber: account.accountNumber,
    amount: 90.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-24T14:00:00Z').toISOString(),
    description: 'Electronics store'
  },
  {
    id: 'TXN-025',
    accountNumber: account.accountNumber,
    amount: 250.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-25T10:30:00Z').toISOString(),
    description: 'Commission payment'
  },
  {
    id: 'TXN-026',
    accountNumber: account.accountNumber,
    amount: 65.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-26T11:50:00Z').toISOString(),
    description: 'Hair salon'
  },
  {
    id: 'TXN-027',
    accountNumber: account.accountNumber,
    amount: 120.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-27T16:30:00Z').toISOString(),
    description: 'Internet bill'
  },
  {
    id: 'TXN-028',
    accountNumber: account.accountNumber,
    amount: 350.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-28T08:20:00Z').toISOString(),
    description: 'Side project payment'
  },
  {
    id: 'TXN-029',
    accountNumber: account.accountNumber,
    amount: 85.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-29T09:10:00Z').toISOString(),
    description: 'Clothing store'
  },
  {
    id: 'TXN-030',
    accountNumber: account.accountNumber,
    amount: 100.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-29T10:00:00Z').toISOString(),
    description: 'Family transfer'
  },
  {
    id: 'TXN-031',
    accountNumber: account.accountNumber,
    amount: 70.00,
    currency: 'USD',
    type: 'payment',
    timestamp: new Date('2025-10-29T10:15:00Z').toISOString(),
    description: 'Lunch with friends'
  },
  {
    id: 'TXN-032',
    accountNumber: account.accountNumber,
    amount: 125.00,
    currency: 'USD',
    type: 'topup',
    timestamp: new Date('2025-10-29T10:30:00Z').toISOString(),
    description: 'Reimbursement'
  }
];

// GET /account - returns the main account number, current balance and currency
app.get('/account', (req: Request, res: Response) => {
  const response: AccountResponse = {
    accountNumber: account.accountNumber,
    balance: account.balance,
    currency: account.currency
  };
  res.json(response);
});

// GET /account/transactions - returns a paginated list of transactions
app.get('/account/transactions', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const sortedTransactions = transactions.toSorted((t1, t2) => 
    new Date(t2.timestamp).getTime() - new Date(t1.timestamp).getTime())

  const paginatedTransactions = sortedTransactions.slice(offset, offset + limit);
  
  const response: TransactionsResponse = {
    transactions: paginatedTransactions,
    total: transactions.length,
    limit,
    offset
  };
  
  res.json(response);
});

// POST /account/topup - add given amount to the account
app.post('/account/topup', (req: Request, res: Response) => {
  const { amount, description }: TopupRequest = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Invalid amount. Must be a positive number.' });
    return;
  }

  // Create new transaction
  const transaction: Transaction = {
    id: `TXN-${String(transactions.length + 1).padStart(3, '0')}`,
    accountNumber: account.accountNumber,
    amount,
    currency: account.currency,
    type: 'topup',
    timestamp: new Date().toISOString(),
    description: description || 'Top-up'
  };

  // Update account balance
  account.balance += amount;

  // Persist transaction
  transactions.push(transaction);

  const response: TopupResponse = {
    transaction,
    newBalance: account.balance
  };

  res.json(response);
});

// GET /openapi.yaml - returns OpenAPI schema for the server
app.get('/openapi.yaml', (req: Request, res: Response) => {
  const openapiSpec = `openapi: 3.0.0
info:
  title: Account Management API
  description: API for managing account balance and transactions
  version: 1.0.0
servers:
  - url: http://localhost:3000
    description: Local development server
paths:
  /account:
    get:
      summary: Get account details
      description: Returns the main account number, current balance and currency
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  accountNumber:
                    type: string
                    example: ACC-2025-001
                  balance:
                    type: number
                    format: float
                    example: 1000.00
                  currency:
                    type: string
                    enum: [USD, EUR, GBP]
                    example: USD
  /account/transactions:
    get:
      summary: Get paginated list of transactions
      description: Returns a paginated list of transactions for the account
      parameters:
        - name: limit
          in: query
          description: Number of records per page
          required: false
          schema:
            type: integer
            default: 10
            example: 10
        - name: offset
          in: query
          description: Index of the page (starting position)
          required: false
          schema:
            type: integer
            default: 0
            example: 0
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  transactions:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                          example: TXN-001
                        accountNumber:
                          type: string
                          example: ACC-2025-001
                        amount:
                          type: number
                          format: float
                          example: 100.00
                        currency:
                          type: string
                          enum: [USD, EUR, GBP]
                          example: USD
                        type:
                          type: string
                          enum: [topup, payment]
                          example: topup
                        timestamp:
                          type: string
                          format: date-time
                          example: 2025-10-29T10:24:00Z
                        description:
                          type: string
                          example: Top-up
                  total:
                    type: integer
                    example: 1
                  limit:
                    type: integer
                    example: 10
                  offset:
                    type: integer
                    example: 0
  /account/topup:
    post:
      summary: Top up account
      description: Add given amount to the account and persist the transaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
              properties:
                amount:
                  type: number
                  format: float
                  example: 100.00
                  description: Amount to add to the account (must be positive)
                description:
                  type: string
                  example: Monthly top-up
                  description: Optional description for the transaction
      responses:
        '200':
          description: Successful top-up
          content:
            application/json:
              schema:
                type: object
                properties:
                  transaction:
                    type: object
                    properties:
                      id:
                        type: string
                        example: TXN-002
                      accountNumber:
                        type: string
                        example: ACC-2025-001
                      amount:
                        type: number
                        format: float
                        example: 100.00
                      currency:
                        type: string
                        enum: [USD, EUR, GBP]
                        example: USD
                      type:
                        type: string
                        enum: [topup, payment]
                        example: topup
                      timestamp:
                        type: string
                        format: date-time
                        example: 2025-10-29T10:24:00Z
                      description:
                        type: string
                        example: Monthly top-up
                  newBalance:
                    type: number
                    format: float
                    example: 1100.00
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid amount. Must be a positive number.
  /openapi.yaml:
    get:
      summary: Get OpenAPI specification
      description: Returns the OpenAPI specification for this API
      responses:
        '200':
          description: OpenAPI specification in YAML format
          content:
            text/yaml:
              schema:
                type: string
`;

  res.setHeader('Content-Type', 'text/yaml');
  res.send(openapiSpec);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
