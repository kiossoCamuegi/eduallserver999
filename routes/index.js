const express = require("express"); 
const path = require('path');

const { GetSingleStudent, GetSingleStudentByCode,GetStudents, GetStudentsByClass, RegisterStudent, StudentDelete, StudentEnrollmentConfirmationUpdate, StudentUpdate, StudentUpdateClass, StudentUpdateEnrollment, uploadStudentPicture, tpath, GetSingleStudentByIdentityCard, GetEmails, GetStudentsByInstitute, GetSTDS} = require("../Controllers/Students");
const { CheckExistentEmail, getSingleUserData, GetUserAccounAccess, getUsers, Login, RegisterUserAccounAccess, RegisterUserAccount, uploadUserAccountPicture, UserAccountDelete, UpdateUserAccount, getSingleUserImageData, CheckUserAccountVerificationCode, UserPasswordReset, UpdateUserPassword, getCurrentUserInformation, UPDATEProfilePicture, uploadUserAccountBackgroundPicture, UPDATEProfileCoverImage, SearchUsers, ChangeCurrentUserPassword} = require("../Controllers/Users");
const VerifyToken  = require("../middleware/VerifyToken");
const { ClassDelete, ClassUpdate, GetClass, GetSingleClass, RegisterClass } = require("../Controllers/Class");
const { CourseDelete, CourseUpdate, GetCourse, GetsingleCourse, RegisterCourse } = require("../Controllers/Courses");
const { AcademicyearDelete, AcademicyearUpdate, GetAcademicYear, GetSingleAcademicYear, RegisterAcademicYear } = require("../Controllers/AcademicYear");
const { ClassRoomDelete, ClassRoomUpdate, GetClassroom, GetSingleClassroom, RegisterClassRoom } = require("../Controllers/ClassRoom");
const { CicleDelete, CicleUpdate, GetCicles, GetSingleCicle, RegisterCicle } = require("../Controllers/Cicles");
const { GetSingleSubject, GetSubjects, RegisterSubject, SubjectDelete, SubjectUpdate } = require("../Controllers/Subjects");
const { GetServices, GetSingleService, RegisterService, ServiceDelete, ServiceUpdate, ServiceUpdateDiscountData } = require("../Controllers/Services");
const { GetServicePayments, GetSinglePaidService, GetSingleServicePayment, RegisterServicePayment, Service_paymentDelete, Service_paymentUpdate, uploadServicepaymentDoc } = require("../Controllers/ServicePayments");


const { AcademicLevelDelete, AcademicLevelUpdate, GetAcademicLevel, GetSingleAcademicLevel, RegisterAcademicLevel } = require("../Controllers/AcademicLevel");

const { GetProviders, GetSingleProvider, ProviderDelete, ProviderUpdate, RegisterProvider } = require("../Controllers/Provider");
const { FeePaymentDelete, FeePaymentUpadate, GetFeepayments, GetSinglePaidMonth, GetSinglePayment, GetSingleStudentFees, RegisterFeepayment } = require("../Controllers/FeesPayments");
const { CoinDelete, CoinUpdate, GetCoins, RegisterCoin } = require("../Controllers/Coins");
const { GetProducts, GetSingleProduct, ProductDelete, ProductUpdate, RegisterProducts, uploadProductPicture } = require("../Controllers/Products");
const { EmployeeDelete, EmployeeUpdate, Getemployees, GetSingleEmployee, RegisterEmployee, uploadEmployeePicture, GetEmployeeByJobTitle, GetEmployeeDataByUser } = require("../Controllers/Employees");
const { GetSpecificFiles, RegisterFile, uploadFiles } = require("../Controllers/FilesStorage");
const { RegisterRequest, GetRequests, RequestUpdate, RequestDelete, GetsingleRequest } = require("../Controllers/Requests");
const { GetSingleStudentTransference, GetStudentTransferences, RegisterStudentTransference, StudentTransferenceDelete, StudentTransferenceUpdate } = require("../Controllers/StudentTransference");
const { GetTransportPassengers, GetTransportsinglePassenger, RegisterTransportPassenger, TransportPassengerDelete, TransportPassengerUpdate, GetTransportsinglePassengerByStudentId } = require("../Controllers/TransportPassengers");
const { GetsingleTransportRoute, GetTransportRoutes, RegisterTransportRoute, TransportRouteDelete, TransportRouteUpdate } = require("../Controllers/TransportRoutes");
const { GetsingleTransportStop, GetTransportStops, RegisterTransportStop, TransportStopDelete, TransportStopUpdate } = require("../Controllers/TransportStops");
const { GetSingleTransportVehicle, GetTransportVehicles, RegisterTransportVehicle, TransportVehicleDelete, TransportVehicleUpdate, uploadTransportVehiclePicture } = require("../Controllers/TransportVehicles");
const { GetsingleTransportMaintenance, GetTransportMaintenances, RegisterTransportMaintenance, TransportMaintenanceDelete, TransportMaintenanceUpdate } = require("../Controllers/TransportMaintenence");
const { GetSingleTransportDriver, GetTransportDrivers, RegisterTransportDriver, TransportDriverDelete, TransportDriverUpdate, uploadTransportDriverPicture } = require("../Controllers/TransportDriver");
const { GetSingleTitleAndHeader, GetTitleAndHeaders, RegisterTitleAndHeader, TitleAndHeaderDelete, TitleAndHeaderUpdate } = require("../Controllers/TitlesAndHeaders");
const { Getparents, GetSingleparent, ParentDelete, ParentUpdate, RegisterParent, uploadParentPicture } = require("../Controllers/Parents");
const { AuthorDelete, AuthorUpdate, GetAuthors, GetSingleAuthor, RegisterAuthor } = require("../Controllers/Authors");
const { GetPublishers, RegisterPublisher , GetSinglePublisher, PublisherDelete,  PublisherUpdate} = require("../Controllers/Publishers");
const { GetSingleTypeofbook, GetTypeofbooks, RegisterTypeofbook, TypeofbookDelete, TypeofbookUpdate } = require("../Controllers/TypeOfBooks");
const { BookCategoryDelete, BookCategoryUpdate, GetBookCategories, GetSingleBookCategory, RegisterBookCategory } = require("../Controllers/BooksCategory");
const { GetRacks, GetSingleRack, RackDelete, RackUpdate, RegisterRack } = require("../Controllers/Racks");
const { BookDelete, BookUpdate, GetBooks, GetSingleBook, Registerbook, uploadBookCover } = require("../Controllers/Books");
const { BorrowedBookDelete, BorrowedBookUpdate, GetBorrowedBooks, GetSingleBorrowedBook, RegisterBorrowedbook } = require("../Controllers/BorrowedBooks");
const { GetSingleTiming, GetTimings, RegisterTiming, TimingDelete, TimingUpdate } = require("../Controllers/Timing");
const { GetSchoolsOfProvenance, GetSingleSchoolsOfProvenance, RegisterSchoolsOfProvenance, SchoolsOfProvenanceDelete, SchoolsOfProvenanceUpdate } = require("../Controllers/SchoolsOfProvenance");
const { DeclarationDelete, DeclarationUpdate, GetDeclarations, GetSingleDeclaration, RegisterDeclaration } = require("../Controllers/Declaration"); 
const { GetStudentEnrollments , GetSingleStudentEnrollment, CheckExistentStudentEnrollment, RegisterStudentEnrollment, StudentEnrollmentDelete, StudentEnrollmentUpdate } = require('../Controllers/StudentEnrollment');
const { DeclarationRequestDelete, DeclarationRequestUpdate, GetDeclarationRequests, GetSingleDeclarationRequest, RegisterDeclarationRequest } = require("../Controllers/DeclarationRequests");
const { EnrollOperationDelete, EnrollOperationUpdate, GetEnrollOperations, GetSingleEnrollOperation, RegisterEnrollOperation } = require("../Controllers/EnrollOperations");
const { GetSinglePaidTransportTuitionMonth, GetSingleTransportTuitionpayment, GetTransportTuitionpayments, RegisterTransportTuitionPayment, TransportTuitionPaymentDelete, TransportTuitionPaymentUpadate } = require("../Controllers/TransportTuitions");
const { AuditoryRegister, GetAuditoryData } = require("../Controllers/Auditory");
const { FeedBackDelete, FeedbackUpdate, GetFeedBacks, GetSingleFeedback, GetSingleUserFeedback, RegisterFeedBack } = require("../Controllers/FeedBacks");
const { GetQuarterlyNotes, GetsingleQuarterlyNote, GetsingleQuarterlyNotebYQrtSub, GetsingleQuarterlyNotebYSubCls, GetsingleQuarterlyNotebYSubStdQrtType, QuarterlyNoteUpdate, RegisterQuarterlyNote, QuarterlyNoteDelete, GetsingleQuarterlyNotebYSubStdQrtTypeClass, GetsingleQuarterlyNoteByID, GetsingleClassScoreByNumber } = require("../Controllers/QuarterlyNotes");
const { GetSingleInstitute, InstituteUpdate, uploadInstituteLogo, GetSingleInstituteByCode, GetCurrentInstituteByCode, GetCurentLicence, GetInstitutes, EduallSearchInstitutes } = require("../Controllers/Institutes");
const { FineDelete, FineUpdate, GetFines, GetSingleFine, GetSingleFineByService, RegisterFine } = require("../Controllers/Fines");
const RefreshToken = require("../Controllers/RefreshToken");
const { GetJobTitles, GetSingleJobTitle } = require("../Controllers/JobTitles");
const { GetSingleTeacherSubject, GetTeacherSubjects, RegisterTeacherSubject, TeacherSubjectDelete } = require("../Controllers/TeacherSubject");
const { GetStudentAttendance, GetStudentAttendanceByTeacher, GetStudentAttendanceByTeacherAndClassSub, GetSingleStudentAttendance, GetAllStudentAttendance, RegisterStudentAttendance, StudentAttendanceDelete, StudentAttendanceUpdate, CheckExistentSingleStudentAttendance, GetStudentAttendanceByClassSubStuQrt } = require("../Controllers/StudentAttendance");
const { GetSingleTeachertiming, GetAllTeacherTiming, GetSingleTeacherTiming, GetTeacherTimingByClassSub, RegisterTeacherTiming, TeacherTimingDelete, GetAllClassTimings } = require("../Controllers/TeacherTimings");
const { RegisterPoint, GetPointsBySubClass } = require("../Controllers/ContinuousAvaliation");
const { GetProjectsByCreator, GetSingleTaskAndProject, GetAllTasksAndProjects, TaskAndProjectDelete, RegisterTaskAndProject } = require("../Controllers/TasksAndProjects");
const { RegisterTaskAndProjectMember, TaskAndProjectMemberDelete, GetMembersByProject } = require("../Controllers/TasksAndProjectsMembers");
const { RegisterLessonSection, GetSingleLessonSection, GetLessonsSectionByGroup, LessonSectionDelete, LessonSectionUpdate, LessonSectionUpdatePosition, GetLessonsSectionBuyGroupCode, GetLessonsSectionByCreator, GetSingerAlbums } = require("../Controllers/LessonsSection");
const { RegisterLessonContent, GetSingleLessonContent, GetLessonsContentBySection, LessonContentSectionDelete, LessonContentSectionUpdate, LessonContentSectionUpdatePosition, GetSingleLessonContentBySection } = require("../Controllers/LessonsSectionContent");
const { RegisterEmployeeAttendance, GetEmployeesAttendance, GetEmployeeAttendanceBycode, EmployeeAttendanceDelete, EmployeeAttendanceUpdate, GetSingleEmployeeAttendance } = require("../Controllers/EmployeeAttendence");
const { GetSingleStudentOldClasses, RegisterOldClass } = require("../Controllers/StudentOldClasses");
const { GetsingleStudentExamNotebYSubStCls, RegisterStudentExamNotes, UpdateStudentExamNotes } = require("../Controllers/StudentExams");
const { GetsingleStudentFeaturedNotebYSubStCls, RegisterStudentFeaturedNotes, UpdateStudentFeaturedNotes } = require("../Controllers/StudentFeaturedNotes");
const { GetSingleUserInstitutes } = require("../Controllers/UserInstitutes");
const { GetSingleUserChilds, ChewckSingleUserChilds, RegisterUserChilds, GetParentsUserChildsByInstitute, GetUserChilds, UserChildDelete } = require("../Controllers/ParentsChilds");
const { RegisteraDS, addAlbum } = require("../Controllers/Ads");
const { RegisterStudentExamCalendar, GetExamsCalendar, GetExamsCalendarByClass, UpdateStudentExamCalendar, DeleteStudentExamCalendar, GetSingleExamCalendar } = require("../Controllers/StudentExamsCalendar");
const { RegisterEnrollment, GetEnrolledStudents, EnrolledStudentDelete, GetSingleEnrolledStudent } = require("../Controllers/Enrollments");
const { RegisterInstituteUserAccount, GetInstituteUserAccounts } = require("../Controllers/InstituteAccounts");
const SendEmailMessage = require("../Controllers/SendEmailMessage");
const { RegisterPublication, GetPostsForCurrentUser, GetCurrentUserPosts, GetUserPostsByContacts } = require("../Controllers/Posts");
const { UpdateCurrentUserInstitute, GetCurrentUserData } = require("../Controllers/GetCurrentUserData");
const { RegisterStudentUserAccount, GetSingleUserStudentAccounts } = require("../Controllers/UserStudentAccounts");
const ChangeServerNetworkStatus = require("../config/ChangeServerNetworkStatus");
const { RegisterTransportPayments, GetTransportPayments, GetSingleTransportPayment, GetSingleTransportPaidMonth, GetSingleStudentTransportPayments, TransportPaymentsDelete, TransportPaymentsUpdate, GetSingleStudentTransportPaymentsByCode } = require("../Controllers/TransportPayments");
const { GetCurrentUserConnections } = require("../Controllers/UserConnections");
const { CreateChatMessage, GetChatMessagesByContact } = require("../Controllers/ChatMessages");
const { RegisterStudentBehavior, GetAllStudentBehaviorByStudentCode } = require("../Controllers/StudentBehavior");
const { FollowInstitute, CheckIfFollowingInstitute, GetSingleInstituteFollowers } = require("../Controllers/InstituteFollowers");
const { MakeUserContactRequest, CheckUserContactRequest } = require("../Controllers/UserContacts");
const { RegisterProfilePageVisitor } = require("../Controllers/ProfilePageViews");
const CalculateRemainingDays = require("../config/CalculateRemainingDays");
const { DATABASE } = require("../config/Database");
const router = express.Router();
 const jwt   = require("jsonwebtoken");     
 
router.get("/" ,  (req, res)=>{
   res.send("Hello my greatest friennds !");
})

router.get("/token", function(req, res){ 
  if(req.session.user){
   if(req.session.user !== undefined && req.session.user !== null){
      const refreshToken =  req.session.user.eduall_user_session_refreshToken;
      const AdminUsername = req.session.user.eduall_user_session_username;
        
      if(!refreshToken) return res.status(300).json(req.session);
    
      if(AdminUsername &&  AdminUsername !== undefined && AdminUsername !== null){ 
         const  query = `SELECT * FROM  eduall_employees LEFT JOIN  eduall_user_accounts ON
         eduall_employees.ed_employee_email = eduall_user_accounts.ed_user_account_email  LEFT JOIN  eduall_system_accounts ON
         eduall_system_accounts.ed_system_account_employee = eduall_employees.ed_employee_id
    
         LEFT JOIN eduall_institutes ON eduall_institutes.ed_institute_code = eduall_system_accounts.ed_system_account_institute_code  
         LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode = eduall_system_accounts.ed_system_account_institute_code
    
         WHERE  eduall_user_accounts.ed_user_account_deleted = 0 AND 
         eduall_employees.ed_employee_deleted = 0 AND  eduall_system_accounts.ed_system_account_name = ?  AND eduall_user_accounts.ed_usertoken = ?`;
    
    
    
         DATABASE.query(query, [AdminUsername, refreshToken], (err, row)=>{ 
            if(err) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !!!!!**!*!"});
            if(!row[0]) return  res.status(300).json({msg:"Erro ao iniciar sessão *!"});
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
    
              if(CalculateRemainingDays (row[0].ed_institute_licence_startDate, row[0].ed_institute_licence_endDate) <= 0){
                  console.log("Reamining days  = "+ CalculateRemainingDays(row[0].ed_institute_licence_startDate, row[0].ed_institute_licence_endDate))
                  console.log("Data sent with error 😢😢😢")
                 return res.status(300).json({msg:"Acesso bloqueiado, renove a sua licença !"})
             }
                if(err) {
                   console.log(err);
                   console.log("Data sent with error 😢😢😢")
                   return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor ++++++++!"});
                }
                const cr_usercode = row[0].ed_user_account_id;
                const cr_username = row[0].ed_user_account_name;
                const cr_useremail = row[0].ed_user_account_email;
                const cr_usertype = 0;
                const cr_username_id =  row[0].ed_system_account_id;
                const cr_user_largecode = row[0].ed_user_account_code;
                const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username_id, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                   expiresIn:'15s'
                });
    
                const  query2 = `SELECT * FROM eduall_user_institutes
                LEFT JOIN eduall_institutes ON   eduall_user_institutes.ed_user_institute_code = eduall_institutes.ed_institute_code 
                LEFT JOIN eduall_institutes_licences ON eduall_institutes_licences.ed_institute_licence_instituteCode =  eduall_user_institutes.ed_user_institute_code  
                WHERE eduall_user_institutes.ed_user_institute_deleted = 0 AND  eduall_user_institutes.ed_user_institute_userCode = ? AND eduall_institutes.ed_institute_code = ?`;
                DATABASE.query(query2, [cr_usercode, row[0].ed_system_account_institute_code], (err, rows)=>{ 
                   console.log(rows);
    
                    if(err) {
                      console.log(err) 
                      console.log("Data sent with error 😢😢😢")
                      return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor *****!"});
                   }
                    if(rows.length >= 1){
                      if(CalculateRemainingDays(rows[0].ed_institute_licence_startDate, rows[0].ed_institute_licence_endDate) <= 0){ 
                         req.session.user.eduall_user_session_curentinstitute =  null;  
                           return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor !@@@@@@@@@@@@@"});
                      }else{ 
                       console.log("Data sent 😜😊😍") 
                        return res.json({accessToken});
                      }
                 
                    }else{
                     console.log("Data sent with error 😢😢😢")
                      req.session.user.eduall_user_session_curentinstitute =  null;
                       return res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor **+*+*+****!"});
                    } 
                })   
            });
         }); 
         }else{ 
          console.log("Token  = ", refreshToken);
            const  query = 'SELECT * FROM eduall_user_accounts WHERE ed_user_account_deleted = 0 AND ed_usertoken = ?';
            DATABASE.query(query, [refreshToken], (err, row)=>{ 
               if(err){
                console.log(err) 
                console.log("Data sent with error 😢😢😢")
                return res.json(err); 
               } 
               if(row.length <= 0) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor -*-*---***"});
               jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
                   if(err) return  res.status(300).json({msg:"Erro ao estabelecer ligação com o servidor */*/*!"});
                   const cr_usercode = row[0].ed_user_account_id;
                   const cr_username = row[0].ed_user_account_name;
                   const cr_useremail = row[0].ed_user_account_email;
                   const cr_usertype = 1;
                   const cr_user_largecode = row[0].ed_user_account_code;
                   const accessToken = jwt.sign({cr_usercode, cr_user_largecode, cr_username, cr_useremail, cr_usertype}, process.env.ACCESS_TOKEN_SECRET,{
                      expiresIn:'15s'
                   }); 
                   console.log("Data sent 😜😊😍")
                   res.json({accessToken});
               });
            }); 
         } 

    }else{
      return res.json({data:null, sessions:req.session});
    } 
  }else{
   return res.json({data:null, sessions:req.session});
  }
})


router.get('/eduallusersaccounts/get/', VerifyToken ,   getUsers);
router.get('/students/get/' , GetSTDS);
router.post('/eduallusersaccountsignup/post',  RegisterUserAccount);
router.post('/login',    Login);
router.get('/eduallcheckexistentuseraccountemail/:EMAIL', VerifyToken ,   CheckExistentEmail);
router.get('/tokensssskjsjs',  RefreshToken);
router.get('/eduallsingleuserdata/get/:ID', VerifyToken ,   getSingleUserData); 
router.get('/eduallgetuserimagebyuser/get/:EMAIL', getSingleUserImageData);  
router.post("/eduallpasswordupdate",   UpdateUserPassword);

router.delete('/logout',  (req, res, next)=>{  
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.send('Top !!')
    })
  })
})



router.put('/edualluseraccountupdate/update/:ID', VerifyToken ,   UpdateUserAccount);
router.get('/eduallgetuseraccess/get/:CODE', VerifyToken ,   GetUserAccounAccess);
router.put("/edualluseraccountdelete/delete/:ID", VerifyToken ,  UserAccountDelete);
router.get("/eduallgetcurrentuserdata/get/", VerifyToken ,  getCurrentUserInformation);
router.get("/eduallsearchusers/search/:TEXT", VerifyToken, SearchUsers);


router.put("/eduallprofilepictureupdate/update/", VerifyToken , uploadUserAccountPicture,  UPDATEProfilePicture);
router.put("/eduallprofilecoverimageupdate/update/", VerifyToken , uploadUserAccountBackgroundPicture, UPDATEProfileCoverImage);


router.post("/eduallpasswordreset",  UserPasswordReset);
router.post("/edualluseraccountverificationcode/post",   CheckUserAccountVerificationCode);
router.post("/eduallinstituteuseraccountregister/post",  RegisterInstituteUserAccount);
router.get("/eduallinstituteuseraccountsget/get", VerifyToken ,   GetInstituteUserAccounts);
router.put("/eduallchangecurrentuserpassword", VerifyToken , ChangeCurrentUserPassword);

// dashboard routes
router.get('/eduallstudentsapi/get', VerifyToken ,   GetStudents);
router.post('/eduallstudentregisterapi/post', VerifyToken ,   uploadStudentPicture , RegisterStudent);
router.get("/eduallsinglestudentapi/get/:ID", VerifyToken ,   GetSingleStudent);
router.get("/eduallgetstudentsbyclass/:CLASS", VerifyToken ,   GetStudentsByClass);
router.get("/eduallgetinstitutestudentsbycode/get/:CODE", VerifyToken, GetStudentsByInstitute);
router.put("/eduallstudentdelete/delete/:ID", VerifyToken ,   StudentDelete);
router.put("/eduallstudentupdate/update/:ID", VerifyToken ,   uploadStudentPicture ,  StudentUpdate);
router.put("/eduallstudentupdateclass/update/:ID", VerifyToken ,   StudentUpdateClass);
router.get("/eduallgetsinglestudentbycode/get/:CODE", VerifyToken ,   GetSingleStudentByCode);
router.put("/eduallstudentenrollmentupdate/update/:ID", VerifyToken ,   StudentUpdateEnrollment); 
router.put("/eduallstudentenrollmentconfirmationupdate/update/:ID", VerifyToken ,  StudentEnrollmentConfirmationUpdate);
router.get("/eduallgetstudentbyidenitycard/get/:IDENTITITYCARD", VerifyToken ,   GetSingleStudentByIdentityCard);


router.get("/eduallemails/get", VerifyToken , GetEmails );
 
router.post('/eduallstudentenrollmentregister/post', VerifyToken ,   RegisterEnrollment);
router.get("/eduallstudentenrollments/get", VerifyToken , GetEnrolledStudents);
router.put("/eduallenrollmentconfirmationcancel/put/:ID", VerifyToken , EnrolledStudentDelete);
router.get("/eduallgetsingleenrolledstudent/get/:ID", VerifyToken , GetSingleEnrolledStudent);

router.get('/eduallclassapi/get', VerifyToken ,   GetClass);
router.get('/eduallsingleclassapi/get/:ID', VerifyToken , GetSingleClass);
router.post('/eduallclassregisterapi/post', VerifyToken , RegisterClass); 
router.put("/eduallclassdelete/delete/:ID", VerifyToken , ClassDelete);
router.put("/eduallclassupdate/update/:ID", VerifyToken , ClassUpdate); 



router.get('/eduallcoursesapi/get', VerifyToken ,   GetCourse);
router.post('/eduallcourseregisterapi/post', VerifyToken ,   RegisterCourse);
router.get("/eduallsinglecoursesapi/get/:ID", VerifyToken ,   GetsingleCourse);
router.put("/eduallcoursedelete/delete/:ID", VerifyToken ,  CourseDelete);
router.put("/eduallcourseupdate/update/:ID", VerifyToken ,  CourseUpdate);

router.get('/eduallacademicyearapi/get', VerifyToken ,   GetAcademicYear);
router.post('/eduallacademicyeargisterapi/post', VerifyToken ,   RegisterAcademicYear);
router.get("/eduallsingleacademicyearapi/get/:ID", VerifyToken ,   GetSingleAcademicYear);
router.put("/eduallacademicyeardelete/delete/:ID", VerifyToken ,   AcademicyearDelete);
router.put("/eduallacademicyearupdate/update/:ID", VerifyToken ,   AcademicyearUpdate);

router.get('/eduallclassroomapi/get', VerifyToken ,   GetClassroom);
router.post('/eduallclassroomregisterapi/post/', VerifyToken ,   RegisterClassRoom);
router.get("/eduallsingleclassroomapi/get/:ID", VerifyToken ,   GetSingleClassroom);
router.put("/eduallclassroomdelete/delete/:ID", VerifyToken ,  ClassRoomDelete);
router.put("/eduallclassroomupdate/update/:ID", VerifyToken ,   ClassRoomUpdate);

router.get('/eduallciclesapi/get', VerifyToken ,   GetCicles);
router.post("/eduallcicleregister/post/", VerifyToken ,   RegisterCicle);
router.get("/eduallsinglecicle/get/:ID", VerifyToken ,   GetSingleCicle);
router.put("/eduallcicledelete/delete/:ID", VerifyToken ,  CicleDelete);
router.put("/eduallcicleupdate/update/:ID", VerifyToken ,   CicleUpdate);

router.get('/eduallsubjectsapi/get', VerifyToken ,   GetSubjects);
router.post("/eduallsubjectregisterapi/post", VerifyToken ,   RegisterSubject);
router.get("/eduallsinglesubject/get/:ID", VerifyToken ,   GetSingleSubject);
router.put("/eduallsubjectdelete/delete/:ID", VerifyToken ,   SubjectDelete);
router.put("/eduallsubjectupdate/update/:ID", VerifyToken ,   SubjectUpdate);

router.post("/eduallserviceregisterapi/post/", VerifyToken ,   RegisterService);
router.get("/eduallservicesapi/get", VerifyToken ,   GetServices);
router.get("/eduallsingleserviceapi/get/:ID", VerifyToken ,   GetSingleService);
router.put("/eduallservicedelete/delete/:ID", VerifyToken ,   ServiceDelete);
router.put("/eduallserviceupdate/update/:ID", VerifyToken ,   ServiceUpdate);
router.put("/eduallupdateservicediscount/update/:ID", VerifyToken ,   ServiceUpdateDiscountData);

router.get("/eduallservicepaymentsapi/get", VerifyToken ,   GetServicePayments);
router.post("/eduallregisterservicepayment/post", VerifyToken ,   uploadServicepaymentDoc ,  RegisterServicePayment);
router.get("/eduallsingleservicepaymentapi/get:ID", VerifyToken ,   GetSingleServicePayment);
router.put("/eduallservicepaymentdelete/delete/:ID", VerifyToken ,   Service_paymentDelete);
router.put("/eduallservicepaymentupdate/update/:ID", VerifyToken ,   Service_paymentUpdate);
router.get("/eduallservicecheckpaidmonth/:MONTH,:STUDENTCODE,:SERVICE,:INSTITUTECODE", VerifyToken ,   GetSinglePaidService);


router.get("/eduallacademiclevelsapi/get", VerifyToken ,   GetAcademicLevel);
router.get("/eduallsingleacademiclevelsapi/get/:ID", VerifyToken ,   GetSingleAcademicLevel);
router.post("/eduallregisteracademiclevel/post", VerifyToken ,   RegisterAcademicLevel);
router.put("/eduallacademicleveldelete/delete/:ID", VerifyToken ,   AcademicLevelDelete);
router.put("/eduallacademiclevelupdate/update/:ID", VerifyToken ,   AcademicLevelUpdate);


router.get("/eduallprovidersapi/get/", VerifyToken ,   GetProviders);
router.post("/eduallregisterprovider/post/", VerifyToken ,   RegisterProvider);
router.get("/eduallgetsingleprovider/get/:ID", VerifyToken ,   GetSingleProvider);
router.put("/eduallproviderdelete/delete/:ID", VerifyToken ,   ProviderDelete);
router.put("/eduallproviderupdate/update/:ID", VerifyToken ,   ProviderUpdate);

router.get("/edualltimings/get/", VerifyToken ,   GetTimings);
router.post("/eduallregistertiming/post/", VerifyToken ,   RegisterTiming);
router.get("/eduallgetsingletiming/get/:ID", VerifyToken ,   GetSingleTiming);
router.put("/edualltimingdelete/delete/:ID", VerifyToken ,   TimingDelete);
router.put("/edualltimingupdate/update/:ID", VerifyToken ,   TimingUpdate);
router.get("/eduallgetclasstimings/get/:CODE", VerifyToken ,   GetAllClassTimings );

router.get("/eduallschoolsofprovenance/get/", VerifyToken ,   GetSchoolsOfProvenance);
router.post("/eduallregisterschoolofprovenance/post/", VerifyToken ,   RegisterSchoolsOfProvenance);
router.get("/eduallgetsingleschoolofprovenance/get/:ID", VerifyToken ,   GetSingleSchoolsOfProvenance);
router.put("/eduallschoolofprovenancedelete/delete/:ID", VerifyToken ,   SchoolsOfProvenanceDelete);
router.put("/eduallschoolofprovenanceupdate/update/:ID", VerifyToken ,   SchoolsOfProvenanceUpdate);

router.get("/edualldeclarations/get/", VerifyToken ,   GetDeclarations);
router.post("/edualldeclarationregister/post/", VerifyToken ,   RegisterDeclaration);
router.get("/eduallgetsingledeclaration/get/:ID", VerifyToken ,   GetSingleDeclaration);
router.put("/edualldeclarationdelete/delete/:ID", VerifyToken ,   DeclarationDelete);
router.put("/edualldeclarationupdate/update/:ID", VerifyToken ,   DeclarationUpdate);

router.post("/eduallregisterfeepayment/post/", VerifyToken ,    RegisterFeepayment);
router.get("/eduallfeepaymentsapi/get/", VerifyToken ,   GetFeepayments);
router.get("/eduallfeepaymentsingle/get/:ID", VerifyToken ,   GetSinglePayment);
router.get("/eduallfeepaymentcheckpaidmonth/:MONTH,:STUDENTCODE,:SERVICE", VerifyToken ,   GetSinglePaidMonth);
router.get("/eduallsinglestudentfeepayment/get/:STUDENTCODE,:ACADEMICYEAR", VerifyToken ,   GetSingleStudentFees);
router.put("/eduallfeepaymentsdelete/delete/:ID", VerifyToken ,   FeePaymentDelete);
router.put("/eduallfeepaymentupdate/update/:ID", VerifyToken ,   FeePaymentUpadate);




router.post("/eduallregistetransportpayment/post/", VerifyToken ,  RegisterTransportPayments);
router.get("/edualltransportpaymentsapi/get/", VerifyToken ,   GetTransportPayments);
router.get("/edualltransportpaymentsingle/get/:ID", VerifyToken ,   GetSingleTransportPayment);

router.get("/edualltransportpaymentcheckpaidmonth/:MONTH,:STUDENTCODE,:YEAR", VerifyToken ,   GetSingleTransportPaidMonth);
router.get("/eduallsinglestudenttransportpayment/get/:PASSENGERCODE,:ACADEMICYEAR", VerifyToken ,   GetSingleStudentTransportPayments);
router.put("/edualltransportpaymentsdelete/delete/:ID", VerifyToken ,   TransportPaymentsDelete);
router.put("/edualltransportpaymentupdate/update/:ID", VerifyToken ,   TransportPaymentsUpdate);
router.get("/eduallgetstudenttransportpaymentsbycode/get/:STUDENTCODE,:ACADEMICYEAR", VerifyToken , GetSingleStudentTransportPaymentsByCode);

router.get("/eduallgetjobtitles/", VerifyToken , GetJobTitles);
router.get("/eduallgetsinglejobtitle/get/:ID", VerifyToken ,  GetSingleJobTitle); 

router.get("/eduallcoinsapi/get/", VerifyToken ,  GetCoins);
router.post("/eduallregistercoins/post/", VerifyToken ,   RegisterCoin);
router.put("/eduallcoindelete/delete/:ID", VerifyToken ,   CoinDelete);
router.put("/eduallcoinupdate/update/:ID", VerifyToken ,   CoinUpdate);

router.post("/eduallproductsregister/post", VerifyToken ,  uploadProductPicture, RegisterProducts);
router.get("/eduallproductsapi/get/", VerifyToken ,   GetProducts);
router.get("/eduallsingleproductapi/get/:ID", VerifyToken ,   GetSingleProduct);
router.put("/eduallproductdelete/delete/:ID", VerifyToken ,   ProductDelete);
router.put("/eduallproductupdate/update/:ID", VerifyToken ,   ProductUpdate);

router.get("/eduallemployeesget/get/", VerifyToken ,   Getemployees);
router.get("/eduallgetemployeebyjobtitle/get/:CODE", VerifyToken ,   GetEmployeeByJobTitle);
router.get("/eduallsinglemployee/get/:ID", VerifyToken ,   GetSingleEmployee);
router.post("/eduallemployeeregister/post/", VerifyToken ,   uploadEmployeePicture , RegisterEmployee);
router.put("/eduallemployeedelete/delete/:ID", VerifyToken ,   EmployeeDelete);
router.put("/eduallemployeeupdate/update/:ID", VerifyToken ,    uploadEmployeePicture, EmployeeUpdate);
router.get("/eduallgetsingleuserandemployeedata/get", VerifyToken ,   GetEmployeeDataByUser);


router.get("/eduallgetteachersubjects/get/:CODE", VerifyToken ,   GetTeacherSubjects);
router.get("/eduallgetsingleteachersubjects/get/:CODE,:ID,:CLASS", VerifyToken ,   GetSingleTeacherSubject);
router.post("/eduallregisterteachersubject/post/", VerifyToken ,   RegisterTeacherSubject);
router.put("/eduallteachersubjectdelete/delete/:ID", VerifyToken ,   TeacherSubjectDelete);


router.post("/eduallfilesregister/post/", VerifyToken ,   uploadFiles, RegisterFile);
router.get("/eduallsingleuserfiles/get/:CODE", VerifyToken ,   GetSpecificFiles);


router.get("/eduallgetsinglestudentoldclasses/get/:CODE", VerifyToken ,   GetSingleStudentOldClasses);
router.post("/eduallregisterstudentoldclass/post/", VerifyToken ,   RegisterOldClass);

 
router.post("/eduallstudenttransferenceregister/post", VerifyToken ,    RegisterStudentTransference);
router.get("/eduallstudenttransferences/get/", VerifyToken ,   GetStudentTransferences);
router.put("/eduallstudenttransferencedelete/:ID", VerifyToken ,   StudentTransferenceDelete);
router.get("/eduallsinglestudenttransference/get/:ID", VerifyToken ,   GetSingleStudentTransference);
router.put("/eduallstudenttransferenceupdate/update/:ID", VerifyToken ,   StudentTransferenceUpdate);

router.post("/edualltitlesandheadersregister/post", VerifyToken ,  RegisterTitleAndHeader);
router.get("/eduallgetsingletitleandheader/get/:ID", VerifyToken ,   GetSingleTitleAndHeader);
router.get("/eduallgettitlesandheaders/get/", VerifyToken ,   GetTitleAndHeaders);
router.put("/edualltitleandheaderdelete/delete/:ID", VerifyToken ,   TitleAndHeaderDelete);
router.put("/edualltitleandheaderupdate/update/:ID", VerifyToken ,   TitleAndHeaderUpdate);

router.post("/eduallenrolloperationregister/post", VerifyToken ,  RegisterEnrollOperation);
router.get("/eduallgetsingleenrolloperation/get/:ID", VerifyToken ,   GetSingleEnrollOperation);
router.get("/eduallgetenrolloperations/get/", VerifyToken ,   GetEnrollOperations);
router.put("/eduallenrolloperationdelete/delete/:ID", VerifyToken ,   EnrollOperationDelete);
router.put("/eduallenrolloperationupdate/update/:ID", VerifyToken ,   EnrollOperationUpdate);

router.get('/eduallparents/get', VerifyToken ,   Getparents);
router.post('/eduallparentregister/post', VerifyToken ,   uploadParentPicture , RegisterParent);
router.get("/eduallsingleparent/get/:ID", VerifyToken ,   GetSingleparent);
router.put("/eduallparentdelete/delete/:ID", VerifyToken ,  ParentDelete);
router.put("/eduallparenteupdate/update/:ID", VerifyToken , uploadParentPicture, ParentUpdate);

router.get('/edualllibraryauthor/get', VerifyToken ,   GetAuthors);
router.post('/edualllibraryauthorregister/post', VerifyToken ,    RegisterAuthor );
router.get("/eduallsinglelibraryauthor/get/:ID", VerifyToken ,   GetSingleAuthor);
router.put("/edualllibraryauthordelete/delete/:ID", VerifyToken ,   AuthorDelete);
router.put("/edualllibraryauthorupdate/update/:ID", VerifyToken ,   AuthorUpdate);

router.get('/eduallstudentenrollments/get', VerifyToken ,   GetStudentEnrollments );
router.post('/eduallstudentenrollmentregister/post', VerifyToken ,    RegisterStudentEnrollment );
router.get("/eduallsinglestudentenrollment/get/:ID", VerifyToken ,   GetSingleStudentEnrollment);
router.get("/eduallchecksinglestudentenrollment/get/:STUDENT", VerifyToken ,   CheckExistentStudentEnrollment);
router.put("/eduallstudentenrollmentdelete/delete/:ID", VerifyToken ,   StudentEnrollmentDelete);
router.put("/eduallstudentenrollmentupdate/update/:ID", VerifyToken ,   StudentEnrollmentUpdate);
 
router.get('/edualllibrarypublishers/get', VerifyToken ,   GetPublishers );
router.post('/edualllibrarypublisherregister/post', VerifyToken ,    RegisterPublisher);
router.get("/eduallsinglelibrarypublisher/get/:ID", VerifyToken ,   GetSinglePublisher );
router.put("/edualllibrarypublisherdelete/delete/:ID", VerifyToken ,   PublisherDelete);
router.put("/edualllibrarypublisherupdate/update/:ID", VerifyToken ,   PublisherUpdate);

router.get('/edualldeclarationrequests/get', VerifyToken ,   GetDeclarationRequests);
router.post('/edualldeclarationrequestregister/post', VerifyToken ,    RegisterDeclarationRequest);
router.get("/eduallsingledeclarationrequest/get/:ID", VerifyToken ,   GetSingleDeclarationRequest);
router.put("/edualldeclarationrequestdelete/delete/:ID", VerifyToken ,   DeclarationRequestDelete);
router.put("/edualldeclarationrequestupdate/update/:ID", VerifyToken ,   DeclarationRequestUpdate);

router.get('/edualllibrarytypeofbooks/get', VerifyToken ,   GetTypeofbooks);
router.post('/edualllibrarytypeofbookregister/post/', VerifyToken ,   RegisterTypeofbook);
router.get("/eduallsinglelibrarytypeofbook/get/:ID", VerifyToken ,   GetSingleTypeofbook);
router.put("/edualllibrarytypeofbookdelete/delete/:ID", VerifyToken ,   TypeofbookDelete);
router.put("/edualllibrarytypeofbookupdate/update/:ID", VerifyToken ,   TypeofbookUpdate);

router.get('/edualllibrarytypecategories/get', VerifyToken ,   GetBookCategories );
router.post('/edualllibrarycategoryregister/post/', VerifyToken ,   RegisterBookCategory);
router.get("/eduallsinglelibrarycategory/get/:ID", VerifyToken ,   GetSingleBookCategory);
router.put("/edualllibrarycategorydelete/delete/:ID", VerifyToken ,   BookCategoryDelete);
router.put("/edualllibrarycategoryupdate/update/:ID", VerifyToken ,   BookCategoryUpdate);

router.get('/edualllibraryracks/get', VerifyToken ,   GetRacks);
router.post('/edualllibraryrackregister/post', VerifyToken ,    RegisterRack );
router.get("/eduallsinglelibraryrack/get/:ID", VerifyToken ,   GetSingleRack);
router.put("/edualllibraryrackdelete/delete/:ID", VerifyToken ,   RackDelete);
router.put("/edualllibraryrackupdate/update/:ID", VerifyToken ,   RackUpdate);

router.get('/edualllibrarybooks/get', VerifyToken ,   GetBooks);
router.post('/edualllibrarybookregister/post', VerifyToken ,   uploadBookCover, Registerbook);
router.get("/eduallsinglelibrarybook/get/:ID", VerifyToken ,   GetSingleBook);
router.put("/edualllibrarybookdelete/delete/:ID", VerifyToken ,   BookDelete);
router.put("/edualllibrarybookupdate/update/:ID", VerifyToken ,   BookUpdate); 

router.get('/edualllibraryborrowedbooks/get', VerifyToken ,   GetBorrowedBooks);
router.post('/edualllibraryborrowbookregister/post', VerifyToken ,   RegisterBorrowedbook);
router.get("/eduallsinglelibraryborrowedbook/get/:ID", VerifyToken ,   GetSingleBorrowedBook);
router.put("/edualllibraryborrowedbookdelete/delete/:ID", VerifyToken ,   BorrowedBookDelete);
router.put("/edualllibraryborrowedbookupdate/update/:ID", VerifyToken ,   BorrowedBookUpdate);

router.get('/eduallauditoryregisters/get', VerifyToken ,   GetAuditoryData);
router.post('/eduallauditoryactionregister/post', VerifyToken ,   AuditoryRegister);

router.get('/eduallfeedbacks/get', VerifyToken ,   GetFeedBacks);
router.post('/eduallfeedbackregister/post', VerifyToken ,   RegisterFeedBack);
router.get("/eduallsinglefeedback/get/:ID", VerifyToken ,   GetSingleFeedback);
router.get("/eduallsingleusersfeedbacks/get", VerifyToken ,   GetSingleUserFeedback);
router.put("/eduallfeedbackdelete/delete/:ID", VerifyToken ,   FeedBackDelete);
router.put("/eduallfeedbackupdate/update/:ID", VerifyToken ,   FeedbackUpdate);  

router.get('/eduallquarterlynotes/get', VerifyToken ,   GetQuarterlyNotes);
router.post('/eduallquarterlynotesregister/post', VerifyToken ,   RegisterQuarterlyNote);
router.get("/eduallsinglequarterlynote/get/:STUDENTCODE", VerifyToken ,   GetsingleQuarterlyNote); 
router.get("/eduallsinglequarterlynotebyqrtsubcls/get/:QUARTER,:SUBJECT,:CLASS", VerifyToken ,   GetsingleQuarterlyNotebYQrtSub); 
router.get("/eduallsinglequarterlynotebyqrtsubstdqrttyp/get/:SUBJECT,:STUDENT,:QUARTER,:CLASS", VerifyToken ,   GetsingleQuarterlyNotebYSubStdQrtType) 
router.get("/eduallsinglequarterlynotebyqrtsubstdqrttypeclass/get/:SUBJECT,:STUDENT,:QUARTER,:CLASS", VerifyToken ,   GetsingleQuarterlyNotebYSubStdQrtTypeClass) 
router.get("/eduallsinglequarterlynotebysubcls/get/:SUBJECT,:CLASS", VerifyToken ,   GetsingleQuarterlyNotebYSubCls); 
router.put("/eduallquarterlynoteupdate/update/:ID", VerifyToken ,   QuarterlyNoteUpdate); 
router.put("/eduallquarterlynotedelete/delete/:ID", VerifyToken ,   QuarterlyNoteDelete); 
router.get("/eduallsinglequarterlynotebyid/get/:ID", VerifyToken ,   GetsingleQuarterlyNoteByID);
router.get("/eduallgetnotesbyclassandsubjects/get/:SUBJECT,:CLASS", VerifyToken ,    GetsingleClassScoreByNumber);


router.get("/eduallgetstudentexamscorebyclassubject/:SUBJECT,:STUDENT,:CLASS", VerifyToken ,   GetsingleStudentExamNotebYSubStCls);
router.post("/eduallstudentexamscoreregister/post", VerifyToken ,   RegisterStudentExamNotes);
router.put("/eduallstudentexamscoreupdate/update/:ID", VerifyToken ,   UpdateStudentExamNotes);



router.get("/eduallgetstudentfeaturedscorebyclassubject/:SUBJECT,:STUDENT,:CLASS", VerifyToken ,   GetsingleStudentFeaturedNotebYSubStCls);
router.post("/eduallstudentfeaturedscoreregister/post", VerifyToken ,   RegisterStudentFeaturedNotes);
router.put("/eduallstudentfeaturedscoreupdate/update/:ID", VerifyToken ,   UpdateStudentFeaturedNotes);
 

router.get("/eduallgetallstudentsattendance/get", VerifyToken ,   GetStudentAttendance);
router.get("/eduallgetstudentsattendancebyteacher/get/:ID", VerifyToken ,   GetStudentAttendanceByTeacher);
router.get("/eduallgetstudentattendancebyteacherclassandsub/get/:ID", VerifyToken ,   GetStudentAttendanceByTeacherAndClassSub);
router.get("/eduallgetsinglestudentattendance/get/:ID", VerifyToken ,   GetSingleStudentAttendance);
router.get("/eduallgetallstudentattendance/get/:CODE,:CLASS", VerifyToken ,   GetAllStudentAttendance);
router.put("/eduallstudentattendancedelete/delete/:ID", VerifyToken ,   StudentAttendanceDelete);
router.put("/eduallstudentattendanceupdate/update/:ID", VerifyToken ,   StudentAttendanceUpdate);
router.post("/eduallstudentattendanceregister/post", VerifyToken ,   RegisterStudentAttendance);
router.get("/eduallgetstudentattendancebyclqrtsubjstcode/get/:CLASS,:SUBJECT,:STUDENT,:QRT", VerifyToken ,  GetStudentAttendanceByClassSubStuQrt);

router.get("/eduallgetallteachertiming/get/:CODE", VerifyToken ,   GetAllTeacherTiming);
router.get("/eduallgetsingleteachertiming/get/:ID,:CODE,:CLASS,:SUBJECT", VerifyToken ,   GetSingleTeacherTiming);
router.get("/eduallgetteachertimingbyclasssub/get/:SUBJECT,:CLASS,:CODE,:ID/", VerifyToken ,   GetTeacherTimingByClassSub);
router.put("/edualldeleteteachertiming/delete/:ID", VerifyToken ,   TeacherTimingDelete);
router.post("/eduallteachertimingregister/post", VerifyToken ,   RegisterTeacherTiming);
router.get("/eduallcheckexistentstudentattendance/get/:CLASS,:SUBJECT,:STUDENT,:TIME,:DATE", VerifyToken ,   CheckExistentSingleStudentAttendance);

router.post("/eduallregisterctnavlpoint/post", VerifyToken ,   RegisterPoint);
router.get("/eduallgetctnavlpointsbysubclass/get/:ID", VerifyToken ,   GetPointsBySubClass);

router.get("/eduallgetalltasksandprojects/get/", VerifyToken ,  GetAllTasksAndProjects);
router.get("/eduallgettasksandprojectsbycreator/get/:CODE", VerifyToken ,   GetProjectsByCreator);
router.get("/eduallgetsingletaskandproject/get/:ID/", VerifyToken ,    GetSingleTaskAndProject);
router.post("/eduallcreatenewtaskandproject/post/", VerifyToken ,   RegisterTaskAndProject);
router.put("/eduallsingletaskandproject/delete/:ID", VerifyToken ,   TaskAndProjectDelete); 


router.get("/eduallgettaskandprojectmembers/get/:CODE", VerifyToken ,   GetMembersByProject);
router.post("/eduallregistertaskandprojectmember/post", VerifyToken ,   RegisterTaskAndProjectMember);
router.put("/edualltaskandprojectdelete/delete/:ID", VerifyToken ,  TaskAndProjectMemberDelete);


router.get("/eduallgetlessonssectionbygroup/get/:CODE", VerifyToken ,   GetLessonsSectionByGroup);
router.get("/eduallgetsinglelessonssection/get/:ID", VerifyToken ,   GetSingleLessonSection);
router.post("/eduallcreatelessonsection/post/", VerifyToken ,   RegisterLessonSection);
router.put("/edualllessonsectionupdateposition/update/:ID", VerifyToken ,   LessonSectionUpdatePosition);
router.put("/edualllessonsectionupdate/update/:ID", VerifyToken ,   LessonSectionUpdate);
router.put("/edualllessonsectiondelete/delete/:ID", VerifyToken ,   LessonSectionDelete);
router.get("/edualllessonsectionbygroupcode/:GROUP", VerifyToken ,   GetLessonsSectionBuyGroupCode);

router.get("/edualllessonsectionbycreator/get/", VerifyToken ,   GetLessonsSectionByCreator) ;


router.get("/eduallgetlessonscontentbysection/get/:CODE", VerifyToken ,   GetLessonsContentBySection);
router.get("/eduallgetsinglelessoncontent/get/:ID", VerifyToken ,   GetSingleLessonContent);
router.post("/edualllessoncontentregister/post/", VerifyToken ,   RegisterLessonContent);
router.put("/edualllessoncontentdelete/delete/:ID", VerifyToken ,   LessonContentSectionDelete);
router.put("/edualllessoncontentupdate/update/:ID", VerifyToken ,   LessonContentSectionUpdate);
router.get("/eduallgetlessoncontentbysection/get/:ID" , VerifyToken, GetSingleLessonContentBySection);
router.put("/edualllessoncontentupdateposition/update/:ID", VerifyToken ,   LessonContentSectionUpdatePosition);


router.get("/eduallgetallemployeesattendence/get/", VerifyToken ,  GetEmployeesAttendance);
router.get("/eduallgetemployeeattendencebycode/get/:CODE", VerifyToken ,  GetEmployeeAttendanceBycode);
router.get("/eduallgetsingleemployeeattendence/get/:ID", VerifyToken ,   GetSingleEmployeeAttendance);
router.post("/eduallregisteremployeeattendence/post/", VerifyToken ,  RegisterEmployeeAttendance);
router.put("/eduallemployeeattendencedelete/delete/:ID", VerifyToken ,  EmployeeAttendanceDelete );
router.put("/eduallemployeeattendenceupdate/update/:ID", VerifyToken ,  EmployeeAttendanceUpdate);



//// transport ###############

router.post("/edualltransportrouteregister/post/", VerifyToken ,   RegisterTransportRoute);
router.get("/edualltransportroutesget/get/", VerifyToken ,   GetTransportRoutes);
router.get("/edualltransportsinglerouteget/get/:ID", VerifyToken ,   GetsingleTransportRoute);
router.put("/edualltransportroutedelete/delete/:ID", VerifyToken ,  TransportRouteDelete);
router.put("/edualltransportrouteupdate/update/:ID", VerifyToken ,   TransportRouteUpdate);

router.post("/edualltransportpassengerregister/post/", VerifyToken ,   RegisterTransportPassenger);
router.get("/edualltransportpassengerget/get/", VerifyToken ,   GetTransportPassengers);
router.get("/edualltransportsinglepassengerget/get/:ID", VerifyToken ,   GetTransportsinglePassenger);
router.put("/edualltransportpassengerdelete/delete/:ID", VerifyToken ,   TransportPassengerDelete);
router.put("/edualltransportpassengerupdate/update/:ID", VerifyToken ,   TransportPassengerUpdate);
router.get("/eduallgetpassengerbystudentcode/:ID", VerifyToken , GetTransportsinglePassengerByStudentId)

router.post("/edualltransportvehicleregister/post/", VerifyToken ,  uploadTransportVehiclePicture, RegisterTransportVehicle);
router.get("/edualltransportvehicleget/get/", VerifyToken ,   GetTransportVehicles);
router.get("/edualltransportsinglevehicleget/get/:ID", VerifyToken ,   GetSingleTransportVehicle);
router.put("/edualltransportvehicledelete/delete/:ID", VerifyToken ,   TransportVehicleDelete);
router.put("/edualltransportvehicleupdate/update/:ID", VerifyToken ,   TransportVehicleUpdate);

router.post("/edualltransportmaintenanceeregister/post/", VerifyToken ,   RegisterTransportMaintenance);
router.get("/edualltransportmaintenanceget/get/", VerifyToken ,   GetTransportMaintenances);
router.get("/edualltransportsinglemaintenanceget/get/:ID", VerifyToken ,   GetsingleTransportMaintenance);
router.put("/edualltransportmaintenancedelete/delete/:ID", VerifyToken ,   TransportMaintenanceDelete);
router.put("/edualltransportmainenanceupdate/update/:ID", VerifyToken ,   TransportMaintenanceUpdate);

router.post("/edualltransportstopsregister/post/", VerifyToken ,   RegisterTransportStop);
router.get("/edualltransportstopsget/get/", VerifyToken ,   GetTransportStops);
router.get("/edualltransportsinglestopget/get/:ID", VerifyToken ,   GetsingleTransportStop);
router.put("/edualltransportstopsdelete/delete/:ID", VerifyToken ,   TransportStopDelete);
router.put("/edualltransportstopupdate/update/:ID", VerifyToken ,   TransportStopUpdate);

router.post("/edualltransportdriverregister/post/", VerifyToken ,   uploadTransportDriverPicture, RegisterTransportDriver);
router.get("/edualltransportsriverget/get/", VerifyToken ,   GetTransportDrivers);
router.get("/edualltransportsingledriverget/get/:ID", VerifyToken ,   GetSingleTransportDriver);
router.put("/edualltransportsdriverdelete/delete/:ID", VerifyToken ,   TransportDriverDelete);
router.put("/edualltransportdriverupdate/update/:ID", VerifyToken ,   TransportDriverUpdate);



router.get("/eduallgetsinglefinebyservice/get/:SERVICE", VerifyToken ,   GetSingleFineByService);
router.get("/eduallgetservicefines/get/", VerifyToken ,   GetFines);
router.put("/eduallfineupdate/update/:ID", VerifyToken ,   FineUpdate);
router.put("/eduallfinedelete/delete/:ID", VerifyToken ,   FineDelete);
router.get("/eduallgetsinglefine/get/:ID", VerifyToken ,    GetSingleFine);
router.post("/eduallfineregister/post", VerifyToken , RegisterFine);




router.post("/eduallregisterrequest/post/", VerifyToken , RegisterRequest);
router.get("/eduallgetrequests/get", VerifyToken ,  GetRequests);
router.put("/eduallrequestupdate/update/:ID", VerifyToken , RequestUpdate);
router.get("/eduallgetsinglerequest/get/:ID", VerifyToken , GetsingleRequest);
router.put("/eduallrequestdelete/delete/:ID", VerifyToken , RequestDelete);




router.post("/edualladsregister/post/:ID", VerifyToken ,   RegisteraDS);
router.get("/eduallgetsingeralbums/", VerifyToken ,   GetSingerAlbums)



router.get("/eduallgetsingleinstitute/get/:ID", VerifyToken ,   GetSingleInstitute);
router.put("/eduallupdateinstitute/update/", VerifyToken ,   uploadInstituteLogo, InstituteUpdate);
router.get("/eduallgetsingleinstitutebycode/get/:CODE", VerifyToken ,   GetSingleInstituteByCode)
router.get("/eduallgetcurentuserinstitute/get/", VerifyToken ,   GetCurrentInstituteByCode);
router.get("/eduallgetallinstitutes/get",  VerifyToken , GetInstitutes);


router.get("/lc", VerifyToken ,   GetCurentLicence);
router.post("/eduallupdatecurrentinstitutecode/post", VerifyToken ,   UpdateCurrentUserInstitute);
router.get("/eduallgetsingleuserinstitutes/get/:CODE", VerifyToken ,   GetSingleUserInstitutes);


router.get("/eduallgetsingleuserchilds/get", VerifyToken ,   GetSingleUserChilds);
router.get("/eduallchecksingleuserchild/get/:USERCODE,:STUDENTCODE", VerifyToken , ChewckSingleUserChilds);
router.get("/eduallgetuserchilds/get/:ID", VerifyToken, GetUserChilds);
router.post("/edualluserchildregister/post/", VerifyToken , RegisterUserChilds);
router.get("/eduallgetuserparentsacccountsbyinstitute/get", VerifyToken, GetParentsUserChildsByInstitute);
router.put("/edualluserchildaccountdelete/delete/:ID", VerifyToken, UserChildDelete);


router.post("/eduallstudentexamcalendarregister/post", VerifyToken ,   RegisterStudentExamCalendar); 
router.get("/eduallstudentexamcalendarget/get/", VerifyToken ,   GetExamsCalendar);
router.get("/eduallstudentexamcalendargetsingle/get/:ID", VerifyToken ,   GetSingleExamCalendar);
router.get("/eduallstudentexamcalendargetbyclass/get/:CLASS", VerifyToken ,   GetExamsCalendarByClass);
router.put("/eduallstudentexamcalendarupdate/update/:ID", VerifyToken ,   UpdateStudentExamCalendar);
router.put("/eduallstudentexamcalendardelete/delete/:ID", VerifyToken ,   DeleteStudentExamCalendar);


router.get("/eduallgetcurrentuserconnections/get", VerifyToken , GetCurrentUserConnections);
router.post("/eduallcreatechatmessage/post/", VerifyToken , CreateChatMessage);
router.get("/eduallgetchatmessagesbycontact/get/:CODE", VerifyToken , GetChatMessagesByContact);



/// user studentaccounts

router.post("/edualluserstudentaccountregister/post", VerifyToken ,   RegisterStudentUserAccount);
router.get("/eduallsingleuserstudentaccountsget/get", VerifyToken ,   GetSingleUserStudentAccounts);


router.post("/eduallstudentbehaviorregister/post/", VerifyToken , RegisterStudentBehavior);
router.get("/eduallgetstudentbehaviorbystudentcode/get/:ID", VerifyToken,  GetAllStudentBehaviorByStudentCode)



router.post("/eduallpublicationregister/post", VerifyToken ,   RegisterPublication); 
router.get("/eduallgetpostforcurrentuser/get", VerifyToken ,  GetPostsForCurrentUser);
router.get("/eduallgetcurrentuiserposts/get", VerifyToken , GetCurrentUserPosts);
router.get("/eduallgetpostsbyusercontactsandfollowers/get", VerifyToken, GetUserPostsByContacts);




router.post("/eduallsendemail/post/", VerifyToken ,   SendEmailMessage);
router.post("/eduallchangeserverinternetstatus/post", VerifyToken ,   ChangeServerNetworkStatus);
router.post("/addalbum", VerifyToken ,   addAlbum);


router.post("/eduallstartfollowinginstitute/post", VerifyToken , FollowInstitute);
router.get("/eduallcheckiffollowinginstitute/get/:CODE", VerifyToken , CheckIfFollowingInstitute);

router.get("/eduallgetinstitutefollowers/get/:CODE", VerifyToken , GetSingleInstituteFollowers);

router.get("/eduallinstitutessearch/search/:TEXT", VerifyToken ,  EduallSearchInstitutes);


router.post("/eduallmakeusercontactrequest/post", VerifyToken , MakeUserContactRequest);
router.get("/eduallcheckifuserisacontact/get/:CODE", VerifyToken , CheckUserContactRequest);



router.post("/eduallprofilepageregistervisitor/post", VerifyToken, RegisterProfilePageVisitor);

module.exports =  router;
