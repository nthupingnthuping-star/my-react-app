import React, { useState } from "react";
import "../style/Home.css";
import logo from "../pictures/logo.png";

// Import components
import StudentAuth from "../components/StudentAuth";
import StudentDashboard from "../components/StudentDashboard";
import LecturerAuth from "../components/LecturerAuth";
import LecturerDashboard from "../components/LecturerDashboard";
import PrincipalLecturerAuth from "../components/PrincipalLecturerAuth";
import PrincipalLecturerDashboard from "../components/PrincipalLecturerDashboard";
import ProgramLeaderAuth from "../components/ProgramLeaderAuth";
import ProgramLeaderDashboard from "../components/ProgramLeaderDashboard";

function Homescreen() {
  const [view, setView] = useState("home"); 
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null); 
  const [lecturer, setLecturer] = useState(null); 
  const [principalLecturer, setPrincipalLecturer] = useState(null); 
  const [programLeader, setProgramLeader] = useState(null); 

  // Auth handlers
  const handleAuth = (userType, userData) => {
    const setters = {
      student: [setStudent, "student-dashboard"],
      lecturer: [setLecturer, "lecturer-dashboard"],
      principal: [setPrincipalLecturer, "principal-dashboard"],
      leader: [setProgramLeader, "program-leader-dashboard"]
    };
    
    const [setUser, dashboardView] = setters[userType];
    setUser(userData);
    setView(dashboardView);
  };

  const handleRoleClick = (userType) => {
    setLoading(true);
    setTimeout(() => {
      setView(`${userType}-auth`);
      setLoading(false);
    }, 600);
  };

  const handleLogout = (userType) => {
    const setters = {
      student: setStudent,
      lecturer: setLecturer,
      principal: setPrincipalLecturer,
      leader: setProgramLeader
    };
    
    setters[userType](null);
    setView("home");
  };

  // Role data
  const roles = [
    {
      type: "student",
      title: "Students",
      desc: "View attendance, grades, and course progress",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    },
    {
      type: "lecturer", 
      title: "Lecturers",
      desc: "Manage classes, reports, and assessments",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
    {
      type: "principal",
      title: "Principal Lecturers", 
      desc: "Oversee academic performance & compliance",
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    },
    {
      type: "leader",
      title: "Program Leaders",
      desc: "Monitor curriculum and strategic outcomes", 
      icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
    }
  ];

  // Loading state
  if (loading) {
    return React.createElement("div", {className: "loading-screen"},
      React.createElement("div", {className: "spinner"}),
      React.createElement("p", null, "Loading portal...")
    );
  }

  // View routing
  const views = {
    "student-auth": React.createElement(StudentAuth, {onLogin: (data) => handleAuth("student", data)}),
    "student-dashboard": React.createElement(StudentDashboard, {student: student, onLogout: () => handleLogout("student")}),
    "lecturer-auth": React.createElement(LecturerAuth, {onLogin: (data) => handleAuth("lecturer", data)}),
    "lecturer-dashboard": React.createElement(LecturerDashboard, {lecturer: lecturer, onLogout: () => handleLogout("lecturer")}),
    "principal-auth": React.createElement(PrincipalLecturerAuth, {onLogin: (data) => handleAuth("principal", data)}),
    "principal-dashboard": React.createElement(PrincipalLecturerDashboard, {principalLecturer: principalLecturer, onLogout: () => handleLogout("principal")}),
    "program-leader-auth": React.createElement(ProgramLeaderAuth, {onLogin: (data) => handleAuth("leader", data)}),
    "program-leader-dashboard": React.createElement(ProgramLeaderDashboard, {programLeader: programLeader, onLogout: () => handleLogout("leader")})
  };

  if (views[view]) return views[view];

  // Home screen
  return React.createElement("div", {className: "home-container"},
    // Header
    React.createElement("header", {className: "home-header"},
      React.createElement("div", {className: "logo-wrapper"},
        React.createElement("img", {src: logo, alt: "Institution Logo", className: "main-logo"})
      )
    ),

    // Hero
    React.createElement("section", {className: "hero"},
      React.createElement("h1", {className: "hero-title"}, "Shape Your Future Through Excellence in Education"),
      React.createElement("p", {className: "hero-subtitle"}, "Empowering learners, inspiring leaders, transforming communities.")
    ),

    // Role Grid
    React.createElement("section", {className: "role-section"},
      React.createElement("h2", {className: "section-title"}, "Access Your Portal"),
      React.createElement("div", {className: "role-grid"},
        roles.map(role => 
          React.createElement("button", {
            key: role.type,
            className: `role-card ${role.type}`,
            onClick: () => handleRoleClick(role.type),
            "aria-label": `${role.title} Login`
          },
            React.createElement("div", {className: "role-icon"},
              React.createElement("svg", {viewBox: "0 0 24 24", "aria-hidden": "true"},
                React.createElement("path", {d: role.icon})
              )
            ),
            React.createElement("h3", null, role.title),
            React.createElement("p", null, role.desc)
          )
        )
      )
    ),

    // Footer
    React.createElement("footer", {className: "home-footer"},
      React.createElement("p", null, `© ${new Date().getFullYear()} Academic Management System. All rights reserved.`)
    )
  );
}

export default Homescreen;