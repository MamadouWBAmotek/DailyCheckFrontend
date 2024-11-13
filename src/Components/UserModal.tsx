// import React from 'react';
// import Logout from '../Components/Logout';
// import styles from '../Styles/UserModal.module.css';

// interface UserModalProps {
//     isOpen: boolean;
//     closeModal: () => void;
//     userName: string | undefined;
//     handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;

// }

// const UserModal: React.FC<UserModalProps> = ({ isOpen, closeModal, userName, handleOverlayClick }) => {
//     if (!isOpen) return null;

//     return (
//         // <div className={styles.modal} onClick={handleOverlayClick}>
//         //     <div className={styles['modal-content']}>
//         //         <div> <span className={styles.close} onClick={closeModal}>&times;</span>
//         //             <h1>{userName}</h1></div>
//         //         < Logout />
//         //     </div>
//         // </div>

//         <div className={styles.modal} onClick={handleOverlayClick}>
//             <div className={styles['modal-content']}>
//                 <span className={styles.close} onClick={closeModal}>&times;</span>
//                 <form>
//                     <h3>{isEditing ? `Edit ${Status[selectedTodo.status]} To-Do` : `${Status[selectedTodo.status]} To-Do Details`}</h3>
//                     <input
//                         type="text"
//                         value={selectedTodo.title}
//                         onChange={(e) => setSelectedTodo({ ...selectedTodo, title: e.target.value })} // Correction ici
//                         disabled={!isEditing}
//                         placeholder='Title'
//                     />
//                     <input
//                         type="text"
//                         value={selectedTodo.description}
//                         onChange={(e) => setSelectedTodo({ ...selectedTodo, description: e.target.value })} // Correction ici
//                         disabled={!isEditing}
//                         placeholder='Description'

//                     />
//                     <input
//                         type="datetime-local"
//                         disabled={!isEditing}
//                         value={new Date(selectedTodo.deadline).toISOString().slice(0, 16)}
//                         onChange={(e) => setSelectedTodo({ ...selectedTodo, deadline: e.target.value })} // Correction ici
//                     />

//                     <div className={styles['button-container']}>
//                         {isEditing ? (
//                             <>
//                                 <button className={styles['cancel']} onClick={(e) => { setIsEditing(false); e.preventDefault() }}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
//                                 <button type='button' className={styles['save']} onClick={(e) => { e.preventDefault; handleUpdateTodo(selectedTodo) }}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></button>
//                             </>
//                         ) : (
//                             <>
//                                 <button className={styles['delete']} onClick={() => handleDeleteTodo(selectedTodo)}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
//                                 {selectedTodo.status == Status.Upcoming ? <button className={styles['cancel']} onClick={() => handleChangeStatus(selectedTodo.id, Status.Cancelled)}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></button> : ""}
//                                 <button className={styles['edit']} onClick={() => setIsEditing(true)}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></button>
//                                 {selectedTodo.status == Status.Upcoming ? <button className={styles['done']} onClick={() => handleChangeStatus(selectedTodo.id, Status.Done)}><FontAwesomeIcon icon={faSquareCheck}></FontAwesomeIcon></button> : ""}                            </>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );

// };

// export default UserModal;
