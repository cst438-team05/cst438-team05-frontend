import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersView from './components/admin/UsersView';
import CoursesView from './components/admin/CoursesView';
import SectionsView from './components/admin/SectionsView';
import {AdminHome, AdminLayout} from './components/admin/AdminLayout';
import {StudentLayout, StudentHome} from './components/student/StudentLayout';
import ScheduleView from './components/student/ScheduleView';
import Transcript from './components/student/Transcript';
import StudentAssignmentsView from './components/student/AssignmentsStudentView';
import CourseEnroll from './components/student/CourseEnroll';
import InstructorLayout from './components/instructor/InstructorLayout';
import InstructorHome from './components/instructor/InstructorHome';
import AssignmentsView from './components/instructor/AssignmentsView';
import EnrollmentsView from './components/instructor/EnrollmentsView';
import InstructorSectionsView from './components/instructor/InstructorSectionsView';
import {PublicLayout, PublicHome} from './components/public/PublicLayout';
import PublicCoursesView from './components/public/CoursesView';
import PublicSectionsView from './components/public/SectionsView';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import { isAuthenticated, getUserRole } from './utils/api';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="courses" element={<PublicCoursesView />} />
            <Route path="sections" element={<PublicSectionsView />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UsersView />} />
            <Route path="courses" element={<CoursesView />} />
            <Route path="sections" element={<SectionsView />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentHome />} />
            <Route path="schedule" element={<ScheduleView />} />
            <Route path="studentAssignments" element={<StudentAssignmentsView />} />
            <Route path="transcript" element={<Transcript />} />
            <Route path="addCourse" element={<CourseEnroll />} />
          </Route>

          {/* Instructor Routes */}
          <Route path="/instructor" element={
            <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
              <InstructorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InstructorHome />} />
            <Route path="assignments" element={<AssignmentsView />} />
            <Route path="enrollments" element={<EnrollmentsView />} />
            <Route path="sections" element={<InstructorSectionsView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
