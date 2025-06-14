### 📘 **User Story: Renting a Car**

---

#### **Use Case 01: Selecting a Random Car from a Category**

**As** a system user
**In order to** retrieve an available car from a specific category
**Given** a car category that contains three different cars
**When** I check for availability
**Then** the system should randomly select one car from the chosen category

---

#### **Use Case 02: Calculating the Final Rental Price with Age-Based Tax**

**As** a system user
**In order to** calculate the final rental price
**Given** a customer who is 50 years old and wants to rent a car for 5 days
**And** the selected car category has a base price of \$37.60 per day
**When** the price is calculated
**Then** an age-based tax of 30% must be added to the daily price
**And** the final price should be calculated using the formula:
`((price per day * tax rate) * number of days)`
**Which results in:**
`((37.6 * 1.3) * 5) = 244.40`
**And** the final amount should be formatted in Brazilian Portuguese as:
`R$ 244,40`

---

#### **Use Case 03: Registering a Rental Transaction**

**As** a system user
**In order to** register a new rental transaction
**Given** a registered customer aged 50
**And** a selected car that costs \$37.60 per day
**And** a rental period of 5 days
**And** today’s date is `November 5th, 2020`
**When** the rental is created
**Then** the transaction should include:

- The customer’s information
- The selected car details
- The final rental price: `R$ 244,40`
- The due date: `10 de Novembro de 2020`, formatted in Brazilian Portuguese
