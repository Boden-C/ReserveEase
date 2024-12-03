# Frontend Function Documentation

## src/components/AuthContext.jsx

/\*\*

-   @typedef {Object} AuthContextType
-   @property {import('firebase/auth').User | null} user - The current user
-   @property {boolean} loading - Whether the auth state is being determined
-   @property {Function} signin - Sign in function
-   @property {Function} signup - Sign up function
-   @property {Function} signout - Sign out function
    \*/
    /\*\*

/\*\*

-   Sign in with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signin)
-   @param {boolean} [remember=false] - Whether to persist auth state
    \*/
    const signin = async (email, password, remember = false) => {

/\*\*

-   Sign up with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signup)
-   @param {string|null} [name=null] - Optional display name
-   @param {boolean} [remember=true] - Whether to persist auth state
    \*/
    const signup = async (email, password, name = null, remember = true) => {

/\*\*

-   Hook for using auth context
-   @returns {AuthContextType} Auth context value
    \*/
    export function useAuth() {

## src/components/PrivateRoute.jsx

/\*\*

-   Route wrapper to protect routes that require authentication
-   @param {Object} props - Component props
-   @param {JSX.Element} props.children - Child components to render if authenticated
-   @returns {JSX.Element} Protected route
    \*/
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/\*\*

-   SignIn page component that handles Firebase authentication
-   @returns {JSX.Element} The SignIn page component
    \*/
    export default function SignIn() {

## src/pages/SignupPage.jsx

/\*\*

-   SignUp component for user registration
-   @returns {JSX.Element} The SignUp form component
    \*/
    export default function SignUp() {

/\*\*

-   Handles form submission for user registration
-   @param {React.FormEvent<HTMLFormElement>} e - Form submission event
    \*/
    const handleSubmit = async (e) => {

## src/scripts/api.js

/\*\*

-   Makes a request to the API.
-   @param {string} url - The endpoint URL.
-   @param {object} options - Fetch options.
-   @param {boolean} auth - Whether to include authentication headers.
-   @returns {Promise<Response>} The response object.
-   @throws {Error} If there is an issue with the request.
    \*/
    export async function request(url, options = {}, auth = false) {

/\*\*

-   Add a new reservation for the currently authenticated user
-   @param {string} spaceId - The ID of the space to reserve
-   @param {Date} start - Start time of the reservation
-   @param {Date} end - End time of the reservation
-   @returns {Promise<string>} - The reservation ID if successful
-   @throws {Error} - If the request fails
    \*/
    export async function addReservation(spaceId, start, end) {

/\*\*

-   Deletes a reservation
-   @param {number} id - The parking ID
-   @param {string} time_block - The start specific time block for the reservation
    \*/
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/\*\*

-   Signs up a new user with the given email and password.
-   @param {string} email - The email for the new user.
-   @param {string} password - The password for the new user.
-   @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
-   @throws {Error} If there is an error during sign-up.
    \*/
    export async function signup(email, password) {

/\*\*

-   Signs in a user with the given email and password.
-   @param {string} email The email of the user.
-   @param {string} password The password of the user.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If an error occurs while signing in.
    \*/
    export async function signin(email, password) {

/\*\*

-   Signs out the current user.
-   @returns {Promise<void>}
-   @throws {Error} If an error occurs while signing out.
    \*/
    export async function signout() {

/\*\*

-   Authenticates the user and returns the Firebase ID token.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If invalid
    \*/
    export async function validateUser() {

# Frontend Function Documentation

## src/components/AuthContext.jsx

/\*\*

-   @typedef {Object} AuthContextType
-   @property {import('firebase/auth').User | null} user - The current user
-   @property {boolean} loading - Whether the auth state is being determined
-   @property {Function} signin - Sign in function
-   @property {Function} signup - Sign up function
-   @property {Function} signout - Sign out function
    \*/
    /\*\*

/\*\*

-   Sign in with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signin)
-   @param {boolean} [remember=false] - Whether to persist auth state
    \*/
    const signin = async (email, password, remember = false) => {

/\*\*

-   Sign up with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signup)
-   @param {string|null} [name=null] - Optional display name
-   @param {boolean} [remember=true] - Whether to persist auth state
    \*/
    const signup = async (email, password, name = null, remember = true) => {

/\*\*

-   Hook for using auth context
-   @returns {AuthContextType} Auth context value
    \*/
    export function useAuth() {

## src/components/PrivateRoute.jsx

/\*\*

-   Route wrapper to protect routes that require authentication
-   @param {Object} props - Component props
-   @param {JSX.Element} props.children - Child components to render if authenticated
-   @returns {JSX.Element} Protected route
    \*/
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/\*\*

-   SignIn page component that handles Firebase authentication
-   @returns {JSX.Element} The SignIn page component
    \*/
    export default function SignIn() {

## src/pages/SignupPage.jsx

/\*\*

-   SignUp component for user registration
-   @returns {JSX.Element} The SignUp form component
    \*/
    export default function SignUp() {

/\*\*

-   Handles form submission for user registration
-   @param {React.FormEvent<HTMLFormElement>} e - Form submission event
    \*/
    const handleSubmit = async (e) => {

## src/scripts/api.js

/\*\*

-   Makes a request to the API.
-   @param {string} url - The endpoint URL.
-   @param {object} options - Fetch options.
-   @param {boolean} auth - Whether to include authentication headers.
-   @returns {Promise<Response>} The response object.
-   @throws {Error} If there is an issue with the request.
    \*/
    export async function request(url, options = {}, auth = false) {

/\*\*

-   Add a new reservation for the currently authenticated user
-   @param {string} spaceId - The ID of the space to reserve
-   @param {Date} start - Start time of the reservation
-   @param {Date} end - End time of the reservation
-   @returns {Promise<string>} - The reservation ID if successful
-   @throws {Error} - If the request fails
    \*/
    export async function addReservation(spaceId, start, end) {

/\*\*

-   Deletes a reservation
-   @param {number} id - The parking ID
-   @param {string} time_block - The start specific time block for the reservation
    \*/
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/\*\*

-   Signs up a new user with the given email and password.
-   @param {string} email - The email for the new user.
-   @param {string} password - The password for the new user.
-   @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
-   @throws {Error} If there is an error during sign-up.
    \*/
    export async function signup(email, password) {

/\*\*

-   Signs in a user with the given email and password.
-   @param {string} email The email of the user.
-   @param {string} password The password of the user.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If an error occurs while signing in.
    \*/
    export async function signin(email, password) {

/\*\*

-   Signs out the current user.
-   @returns {Promise<void>}
-   @throws {Error} If an error occurs while signing out.
    \*/
    export async function signout() {

/\*\*

-   Authenticates the user and returns the Firebase ID token.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If invalid
    \*/
    export async function validateUser() {

# Frontend Function Documentation

## src/components/AuthContext.jsx

/\*\*

-   @typedef {Object} AuthContextType
-   @property {import('firebase/auth').User | null} user - The current user
-   @property {boolean} loading - Whether the auth state is being determined
-   @property {Function} signin - Sign in function
-   @property {Function} signup - Sign up function
-   @property {Function} signout - Sign out function
    \*/
    /\*\*

/\*\*

-   Sign in with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signin)
-   @param {boolean} [remember=false] - Whether to persist auth state
    \*/
    const signin = async (email, password, remember = false) => {

/\*\*

-   Sign up with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signup)
-   @param {string|null} [name=null] - Optional display name
-   @param {boolean} [remember=true] - Whether to persist auth state
    \*/
    const signup = async (email, password, name = null, remember = true) => {

/\*\*

-   Hook for using auth context
-   @returns {AuthContextType} Auth context value
    \*/
    export function useAuth() {

## src/components/PrivateRoute.jsx

/\*\*

-   Route wrapper to protect routes that require authentication
-   @param {Object} props - Component props
-   @param {JSX.Element} props.children - Child components to render if authenticated
-   @returns {JSX.Element} Protected route
    \*/
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/\*\*

-   SignIn page component that handles Firebase authentication
-   @returns {JSX.Element} The SignIn page component
    \*/
    export default function SignIn() {

## src/pages/SignupPage.jsx

/\*\*

-   SignUp component for user registration
-   @returns {JSX.Element} The SignUp form component
    \*/
    export default function SignUp() {

/\*\*

-   Handles form submission for user registration
-   @param {React.FormEvent<HTMLFormElement>} e - Form submission event
    \*/
    const handleSubmit = async (e) => {

## src/scripts/api.js

/\*\*

-   Makes a request to the API.
-   @param {string} url - The endpoint URL.
-   @param {object} options - Fetch options.
-   @param {boolean} auth - Whether to include authentication headers.
-   @returns {Promise<Response>} The response object.
-   @throws {Error} If there is an issue with the request.
    \*/
    export async function request(url, options = {}, auth = false) {

/\*\*

-   Add a new reservation for the currently authenticated user
-   @param {string} spaceId - The ID of the space to reserve
-   @param {Date} start - Start time of the reservation
-   @param {Date} end - End time of the reservation
-   @returns {Promise<string>} - The reservation ID if successful
-   @throws {Error} - If the request fails
    \*/
    export async function addReservation(spaceId, start, end) {

/\*\*

-   Deletes a reservation
-   @param {number} id - The parking ID
-   @param {string} time_block - The start specific time block for the reservation
    \*/
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/\*\*

-   Signs up a new user with the given email and password.
-   @param {string} email - The email for the new user.
-   @param {string} password - The password for the new user.
-   @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
-   @throws {Error} If there is an error during sign-up.
    \*/
    export async function signup(email, password) {

/\*\*

-   Signs in a user with the given email and password.
-   @param {string} email The email of the user.
-   @param {string} password The password of the user.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If an error occurs while signing in.
    \*/
    export async function signin(email, password) {

/\*\*

-   Signs out the current user.
-   @returns {Promise<void>}
-   @throws {Error} If an error occurs while signing out.
    \*/
    export async function signout() {

/\*\*

-   Authenticates the user and returns the Firebase ID token.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If invalid
    \*/
    export async function validateUser() {

# Frontend Function Documentation

## src/components/AuthContext.jsx

/\*\*

-   @typedef {Object} AuthContextType
-   @property {import('firebase/auth').User | null} user - The current user
-   @property {boolean} loading - Whether the auth state is being determined
-   @property {Function} signin - Sign in function
-   @property {Function} signup - Sign up function
-   @property {Function} signout - Sign out function
    \*/
    /\*\*

/\*\*

-   Sign in with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signin)
-   @param {boolean} [remember=false] - Whether to persist auth state
    \*/
    const signin = async (email, password, remember = false) => {

/\*\*

-   Sign up with email/password or provider
-   @param {string|'google'|'github'} email - Email or provider name
-   @param {string} [password] - Password (not needed for provider signup)
-   @param {string|null} [name=null] - Optional display name
-   @param {boolean} [remember=true] - Whether to persist auth state
    \*/
    const signup = async (email, password, name = null, remember = true) => {

/\*\*

-   Hook for using auth context
-   @returns {AuthContextType} Auth context value
    \*/
    export function useAuth() {

## src/components/CampusMap.jsx

/\*\*

-   Interactive campus map component
-   @param {Object} props Component props
-   @param {string|null} props.selectedSpace Currently selected space ID
-   @param {(id: string) => void} props.onSpaceSelect Callback when a space is selected
-   @param {Array<ParkingSpace>} props.parkingSpaces Array of parking spaces with availability
-   @param {boolean} props.isLoading Loading state indicator
-   @returns {JSX.Element} CampusMap component
    \*/
    export default function CampusMap({ selectedSpace, onSpaceSelect, parkingSpaces = [], isLoading }) {

## src/components/date-picker.jsx

/\*\*

-   A date picker component that allows selecting a date through a calendar interface
-   @param {Object} props
-   @param {Date} [props.initialDate] - Initial date to display
-   @param {(date: Date) => void} props.onDateChange - Callback when date changes
-   @param {Date} [props.minDate] - Minimum selectable date
-   @param {Date} [props.maxDate] - Maximum selectable date
-   @param {Date} props.value - Current date value
    \*/
    const DatePicker = ({ onDateChange, minDate = new Date(), maxDate, value }) => {

## src/components/FutureDateTimePicker.jsx

/\*\*

-   DateTimePicker that only allows future dates and 15-minute time increments
-   Defaults to current time rounded down to nearest 15 minutes
-   @param {object} props Component props
-   @param {Date} [props.value] Selected date/time
-   @param {(date?: Date) => void} [props.onChange] Callback when date/time changes
-   @param {string} [props.placeholder] Placeholder text when no date is selected
-   @param {string} [props.className] Additional CSS classes
    \*/
    const FutureDateTimePicker = ({

## src/components/NavBar.jsx

/\*\*

-   Navigation bar component with theme switching, datetime picker, and authentication
    \*/
    export function NavBar({ selectedDateTime, onDateTimeChange }) {

## src/components/PrivateRoute.jsx

/\*\*

-   Route wrapper to protect routes that require authentication
-   @param {Object} props - Component props
-   @param {JSX.Element} props.children - Child components to render if authenticated
-   @returns {JSX.Element} Protected route
    \*/
    export function PrivateRoute({ children }) {

## src/components/ReservationsList.jsx

/\*\*

-   Component to display a simplified list of user reservations
-   @param {{
-   reservations: Array<{
-   reservation_id: string,
-   space_id: string,
-   start_timestamp: string,
-   end_timestamp: string
-   }>,
-   isFirstLoad: boolean,
-   onDelete: (id: string) => Promise<void>
-   }} props
    \*/
    const ReservationsList = ({ reservations, isFirstLoad, onDelete }) => {

## src/components/RightSide.jsx

/\*\*

-   Right side component managing reservations list and creation views
-   @param {Object} props
-   @param {string | null} props.selectedSpace - ID of the selected parking space
-   @returns {JSX.Element}
-   @throws {Error} Throws errors from useReservations for parent error boundary
    \*/
    const RightSide = ({ selectedSpace, onSpaceChange, selectedDateTime }) => {

## src/components/time-picker.jsx

/\*\*

-   Generates array of time slots in 15-minute increments
-   @returns {string[]} Array of time strings in 24-hour format
    \*/
    const generateTimeSlots = () => {

/\*\*

-   A time picker component that allows selecting time in 15-minute increments
-   @param {Object} props
-   @param {string} [props.initialTime] - Initial time in 24-hour format (HH:mm)
-   @param {(time: string) => void} props.onTimeChange - Callback when time changes
-   @param {string} [props.minTime] - Minimum selectable time in 24-hour format
-   @param {string} [props.maxTime] - Maximum selectable time in 24-hour format
-   @param {string} props.value - Current time value
    \*/
    const TimePicker = ({ onTimeChange, minTime = '00:00', maxTime = '23:45', value }) => {

## src/components/useReservations.jsx

/\*\*

-   @typedef {Object} Reservation
-   @property {string} reservation_id
-   @property {string} space_id
-   @property {string} start_timestamp
-   @property {string} end_timestamp
    \*/
    /\*\*

/\*\*

-   @typedef {Object} Action
-   @property {string} type
-   @property {any} payload
    _/
    /\*\* @type {ReservationsState} _/

/\*\*

-   Reducer for managing reservation state
-   @param {ReservationsState} state
-   @param {Action} action
-   @returns {ReservationsState}
    \*/
    const reservationsReducer = (state, action) => {

/\*\*

-   Custom hook for managing reservations with optimistic updates and error handling
-   @returns {{
-   reservations: Reservation[],
-   isFirstLoad: boolean,
-   addReservation: (params: {
-   space_id: string,
-   start_timestamp: Date,
-   end_timestamp: Date
-   }) => Promise<string>,
-   removeReservation: (id: string) => Promise<void>,
-   refreshReservations: () => Promise<void>
-   }}
    \*/
    export const useReservations = () => {

## src/pages/DashboardPage.jsx

/\*\*

-   Error Fallback component for displaying errors
-   @param {{ error: Error, resetErrorBoundary: () => void }} props
    \*/
    const ErrorFallback = ({ error, resetErrorBoundary }) => (

/\*\*

-   Main reservations page component
-   @returns {JSX.Element} ReservationsPage component
    \*/
    const ReservationsPage = () => {

## src/pages/SigninPage.jsx

/\*\*

-   SignIn page component that handles Firebase authentication
-   @returns {JSX.Element} The SignIn page component
    \*/
    export default function SignIn() {

## src/pages/SignupPage.jsx

/\*\*

-   SignUp component for user registration
-   @returns {JSX.Element} The SignUp form component
    \*/
    export default function SignUp() {

/\*\*

-   Handles form submission for user registration
-   @param {React.FormEvent<HTMLFormElement>} e - Form submission event
    \*/
    const handleSubmit = async (e) => {

## src/scripts/api.js

/\*\*

-   Represents a parking space reservation
-   @typedef {Object} Reservation
-   @property {string} reservation_id - Unique identifier for the reservation
-   @property {string?} user_id - ID of the user who made the reservation
-   @property {string} space_id - ID of the reserved parking space
-   @property {string?} status - Current status of the reservation
-   @property {Date?} created_at - ISO timestamp of when the reservation was created
-   @property {Date} start_timestamp - ISO timestamp of when the reservation starts
-   @property {Date} end_timestamp - ISO timestamp of when the reservation ends
    \*/
    /\*\*

/\*\*

-   Makes a request to the API.
-   @param {string} url - The endpoint URL.
-   @param {object} options - Fetch options.
-   @param {boolean} auth - Whether to include authentication headers.
-   @returns {Promise<Response>} The response object.
-   @throws {Error} If there is an issue with the request.
    \*/
    export async function request(url, options = {}, auth = false) {

/\*\*

-   Edits an existing parking spot.
-   @param {string} parkingId - ID of the parking spot to edit.
-   @param {{
-   name?: string,
-   location?: string,
-   status?: string
-   }} updates - Fields to update for the parking spot.
-   @returns {Promise<{message: string}>} Success message.
    \*/
    export async function editParking(parkingId, updates) {

/\*\*

-   Creates a new reservation
-   @param {{
-   space_id: string,
-   start_timestamp: Date,
-   end_timestamp: Date
-   }} reservation - Reservation details
-   @returns {Promise<{id: string, message: string}>} Created reservation info
    \*/
    export async function createReservation({ space_id, start_timestamp, end_timestamp }) {

/\*\*

-   Deletes a reservation
-   @param {string} reservationId - ID of reservation to delete
-   @returns {Promise<{message: string}>} Success message
    \*/
    export async function deleteReservation(reservationId) {

/\*\*

-   Gets all reservations for the authenticated user
-   @returns {Promise<Array<Reservation>>} List of user's reservations
    \*/
    export async function getUserReservations() {

/\*\*

-   Gets and filters reservations based on criteria
-   @param {{
-   reservation_id?: string,
-   space_id?: string,
-   start_timestamp?: Date,
-   end_timestamp?: Date,
-   from?: Date,// Filter reservations where end_time > from
-   to?: Date // Filter reservations where start_time < to
-   }} filters - Optional filters
-   @returns {Promise<Array<Reservation>>} Filtered reservations
    \*/
    export async function getReservations(filters = {}) {

/\*\*

-   Gets parking spaces with availability information for a given date
-   @param {Date} date - The date to check for parking availability
-   @returns {Promise<Array<ParkingSpace>>} List of parking spaces with updated availability
    \*/
    export async function getParkingWithAvailabilityAt(date) {

## src/scripts/auth.js

/\*\*

-   Signs up a new user with the given email and password.
-   @param {string} email - The email for the new user.
-   @param {string} password - The password for the new user.
-   @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
-   @throws {Error} If there is an error during sign-up.
    \*/
    export async function signup(email, password) {

/\*\*

-   Signs in a user with the given email and password.
-   @param {string} email The email of the user.
-   @param {string} password The password of the user.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If an error occurs while signing in.
    \*/
    export async function signin(email, password) {

/\*\*

-   Signs out the current user.
-   @returns {Promise<void>}
-   @throws {Error} If an error occurs while signing out.
    \*/
    export async function signout() {

/\*\*

-   Authenticates the user and returns the Firebase ID token.
-   @returns {Promise<string>} The Firebase ID token.
-   @throws {Error} If invalid
    \*/
    export async function validateUser() {
