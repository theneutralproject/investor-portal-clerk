# Comprehensive Test Plan

- [x] Require tests to succeed before merging in Github Actions


## 1. Dashboard (/Projects route)

### 1.1 User Welcome
- [ ] Verify that the welcome message displays the mocked user name correctly
  - Example: "Welcome, Brent"

### 1.2 Project Display
- [x] Ensure at least one project is visible on the dashboard
- [ ] Verify that each project displays the following information correctly:
  - [ ] Relevant title
  - [ ] Location
  - [ ] IRR (Internal Rate of Return)
  - [ ] Term

### 1.3 Navigation
- [ ] Confirm that clicking on a project properly redirects to its detailed view

## 2. Learn Route

### 2.1 Accordion Functionality
- [ ] Verify that all accordions open and close properly
- [ ] Check that accordion content is displayed correctly when opened

### 2.2 Call-to-Action Buttons
- [ ] Ensure "Schedule a call" button opens the correct modal
- [ ] Confirm "Get in touch" button opens the appropriate modal

## 3. Contact Route

### 3.1 Email Functionality
- [ ] Verify that the "Send an email" option works correctly

### 3.2 Call Scheduling
- [ ] Ensure the "Schedule call" option opens the correct modal or redirects as expected

### 3.3 Learn Page Redirect
- [ ] Confirm that the option to visit the learn page redirects properly

## 4. Project Detail Page (/Projects/[slug] route)

### 4.1 Content Population
- [ ] Verify that the following details are correctly populated:
  - [ ] Title
  - [ ] Description
  - [ ] Other relevant project information

### 4.2 Deal Flow Logic
- [x] Ensure the deal flow logic is functioning as expected

### 4.3 Tab Functionality
- [ ] Confirm that tab changes work properly
- [ ] Verify that tab content updates correctly when switched

### 4.4 Tab Positioning
- [ ] Check that tab positioning is correct based on the current deal stage

## 5. All Projects Overview

### 5.1 Project Listing
- [ ] Verify that all projects are listed correctly
- [ ] Ensure each project displays:
  - [ ] Project image
  - [ ] Title
  - [ ] Location
  - [ ] IRR
  - [ ] Term

### 5.2 Specific Project Examples
- [ ] Confirm the following projects are displayed with correct information:

#### 5.2.1 The Edison
- [ ] Location: Milwaukee, WI
- [ ] IRR: 20.4%
- [ ] Term: 60mo.

#### 5.2.2 Bakers Place
- [ ] Location: Madison, WI
- [ ] IRR: 14.8%
- [ ] Term: 60mo.

#### 5.2.3 519 W Main
- [ ] Location: Madison, WI
- [ ] IRR: 18%
- [ ] Term: 60mo.

## 6. General UI/UX

### 6.1 Responsiveness
- [ ] Test the application on various screen sizes and devices
- [ ] Ensure all elements adjust appropriately for different viewports

### 6.2 Performance
- [ ] Check load times for different pages and components
- [ ] Verify smooth transitions between routes

### 6.3 Accessibility
- [ ] Test navigation using keyboard only
- [ ] Verify proper use of ARIA labels and roles

## 7. Error Handling

### 7.1 Invalid Routes
- [ ] Confirm that accessing non-existent routes returns appropriate error pages

### 7.2 Data Loading Errors
- [ ] Test behavior when data fails to load (e.g., network issues)
- [ ] Verify error messages are displayed to the user

## 8. Security

### 8.1 Authentication
- [ ] Verify that protected routes require proper authentication
- [ ] Test logout functionality

### 8.2 Data Protection
- [ ] Ensure sensitive data is not exposed in the frontend

## 9. Integration Tests

### 9.1 API Endpoints
- [ ] Verify all API calls are functioning correctly
- [ ] Test error handling for API failures

### 9.2 Third-party Services
- [ ] Confirm integration with any third-party services (if applicable)

## 10. Performance Testing

### 10.1 Load Time
- [ ] Measure and optimize page load times
- [ ] Verify efficient loading of images and other media

### 10.2 Concurrent Users
- [ ] Test application behavior under simulated high user load
