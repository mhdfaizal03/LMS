# COMPLETE LMS UI/UX DESIGN SYSTEM — FIGMA AI MASTER PROMPT

Design a complete, professional, modern Learning Management System (LMS) UI/UX.

This is NOT a landing-page-only design.

Create the complete authenticated LMS product interface for:

1. ADMIN
2. INSTRUCTOR / TUTOR
3. STUDENT

The design must be detailed enough that a React developer can implement the screens directly from the Figma design.

The UI must feel like a real production SaaS/LMS product rather than a template, concept, or visual mockup.

Every important workflow must have a corresponding screen, interaction state, empty state, loading state, error state, success state, confirmation state, and responsive version where appropriate.

Do not create fake or decorative functionality.

==================================================

# 1. CORE PRODUCT STRUCTURE

==================================================

The LMS has three separate authenticated application areas.

ADMIN:

/lms/admin

INSTRUCTOR / TUTOR:

/instructor

STUDENT:

/student

Keep these three areas visually related through one design system while giving each role the appropriate navigation and functionality.

The application should feel like one cohesive product.

==================================================

# 2. DESIGN DIRECTION

==================================================

Create a premium modern SaaS education interface.

Design characteristics:

* Clean
* Professional
* Minimal
* Modern
* Highly usable
* Spacious
* Excellent typography
* Strong hierarchy
* Subtle visual depth
* Consistent spacing
* Clear information architecture
* Accessible
* Responsive

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Huge decorative graphics
* Overly colorful dashboards
* Excessive rounded cards
* Tiny typography
* Cluttered interfaces
* Random colors
* Excessive shadows
* Unnecessary animations
* Generic template appearance

The interface should be suitable for:

* Universities
* Training institutes
* Professional education
* Corporate learning
* Online courses
* Certification programs

==================================================

# 3. DESIGN SYSTEM

==================================================

Create a complete reusable design system.

Include:

## Colors

Define:

* Primary
* Primary hover
* Primary active
* Secondary
* Background
* Surface
* Surface elevated
* Border
* Text primary
* Text secondary
* Text muted
* Success
* Warning
* Error
* Info

Create both:

Light theme

Dark theme

Do not rely only on color to communicate status.

==================================================

# 4. TYPOGRAPHY

==================================================

Use a modern readable sans-serif font.

Create typography styles for:

* Display
* H1
* H2
* H3
* H4
* Body large
* Body
* Body small
* Caption
* Label
* Button
* Table text

Maintain excellent readability.

==================================================

# 5. SPACING SYSTEM

==================================================

Use a consistent spacing scale.

Prefer a systematic spacing system such as:

4
8
12
16
20
24
32
40
48
64
80

Do not randomly choose spacing between components.

==================================================

# 6. COMPONENT LIBRARY

==================================================

Create reusable Figma components with variants.

Components should include:

Buttons

* Primary
* Secondary
* Outline
* Ghost
* Danger
* Success
* Icon button
* Loading
* Disabled

Inputs

* Text
* Email
* Password
* Number
* Search
* Textarea
* Select
* Multi-select
* Date
* Time
* File upload

States:

* Default
* Focus
* Filled
* Error
* Disabled
* Loading

Other components:

* Checkbox
* Radio
* Switch
* Tabs
* Breadcrumb
* Badge
* Avatar
* Dropdown
* Tooltip
* Modal
* Drawer
* Toast
* Alert
* Confirmation dialog
* Pagination
* Table
* Card
* Course card
* User card
* Progress bar
* Progress circle
* Rating
* Calendar
* Date picker
* Stepper
* Timeline
* Accordion
* Empty state
* Skeleton loader

==================================================

# 7. ICON SYSTEM

==================================================

Use one consistent icon style.

Icons must be:

* Simple
* Professional
* Consistent stroke weight
* Accessible
* Easy to understand

Do not mix unrelated icon styles.

==================================================

# 8. RESPONSIVE SYSTEM

==================================================

Design responsive layouts for:

Desktop:
1440px

Laptop:
1280px

Tablet:
768px

Mobile:
390px

Important:

Do not merely shrink desktop layouts.

Create proper responsive behavior.

Sidebar should collapse appropriately.

Tables should adapt.

Cards should reflow.

Forms should become single-column where appropriate.

Navigation should become mobile-friendly.

==================================================

# 9. AUTHENTICATION UI

==================================================

Create complete authentication screens.

## Login

Include:

* Logo
* Email
* Password
* Show/hide password
* Remember me
* Forgot password
* Login button
* Loading state
* Validation errors
* Server error
* Success state
* Registration link

## Registration

Fields:

* Name
* Email
* Password
* Confirm password
* Terms acceptance
* Create account

States:

* Validation
* Loading
* Success
* Error

## Forgot password

Email input.

Success confirmation.

Error state.

## Reset password

New password.

Confirm password.

Password strength indicator.

Success.

## Session expired

Professional session-expired screen/dialog.

==================================================

# 10. ADMIN APPLICATION

==================================================

Admin application starts at:

/lms/admin

Create a complete admin dashboard.

---

## ADMIN SIDEBAR

Navigation:

Dashboard

Users

Students

Instructors

Courses

Categories

Enrollments

Quizzes

Assignments

Certificates

Announcements

Notifications

Reports

Settings

Profile

Logout

Clearly indicate active navigation.

---

## ADMIN DASHBOARD

Create:

* Total users
* Total students
* Total instructors
* Total courses
* Published courses
* Total enrollments
* Completion rate
* Platform activity

Charts:

* Enrollment trend
* Course completion
* User growth
* Course performance

Recent activity.

Recent enrollments.

Top courses.

Upcoming activities.

Every metric should visually indicate:

* Current value
* Previous comparison where appropriate
* Trend
* Meaning

Avoid fake-looking excessive charts.

---

## ADMIN USERS

Create users management.

Table columns:

* User
* Email
* Role
* Status
* Courses
* Joined
* Last active
* Actions

Controls:

* Search
* Filter
* Role filter
* Status filter
* Sort
* Pagination

Actions:

View

Edit

Change role

Activate/deactivate

Delete

Create confirmation dialogs.

---

## USER DETAILS

Show:

Profile

Role

Status

Joined date

Activity

Enrollments

Courses

Certificates

Recent activity

Admin actions.

---

## ADMIN STUDENTS

Create student management page.

Include:

* Search
* Filters
* Student table
* Enrollment count
* Completion rate
* Last active
* Status

Student detail page.

---

## ADMIN INSTRUCTORS

Create instructor management.

Include:

* Instructor list
* Courses
* Students
* Rating where applicable
* Status
* Joined date

Instructor details.

---

## ADMIN COURSES

Create course management.

Table/list:

* Thumbnail
* Course
* Instructor
* Category
* Students
* Status
* Completion
* Created
* Actions

Filters:

* Status
* Category
* Instructor
* Date

Actions:

* View
* Edit
* Publish
* Unpublish
* Archive
* Delete

---

## ADMIN COURSE DETAILS

Display:

Course overview

Instructor

Students

Curriculum

Lessons

Quizzes

Assignments

Statistics

Enrollments

Completion

Activity

Admin actions.

---

## ADMIN CATEGORIES

Create:

Category list

Create category

Edit category

Delete category

Search

Sort

Status

Category details.

---

## ADMIN ENROLLMENTS

Create enrollment management.

Columns:

Student

Course

Instructor

Enrolled date

Progress

Status

Completion

Actions

Include filters and search.

---

## ADMIN QUIZZES

Create quiz management.

Show:

Quiz

Course

Questions

Attempts

Average score

Pass rate

Status

Actions

---

## ADMIN ASSIGNMENTS

Show:

Assignment

Course

Students

Submissions

Pending grading

Deadline

Status

---

## ADMIN CERTIFICATES

Show:

Certificate ID

Student

Course

Issue date

Status

Verification

Actions

Certificate preview.

---

## ADMIN ANNOUNCEMENTS

Create:

Announcement list

Create announcement

Edit

Publish

Schedule

Archive

Audience selector

Preview.

---

## ADMIN REPORTS

Create professional analytics/report screens.

Reports:

* User growth
* Enrollment
* Course performance
* Completion
* Quiz performance
* Assignment performance
* Instructor performance

Filters:

Date range

Course

Category

Instructor

Export button.

---

## ADMIN SETTINGS

Sections:

General

Branding

Users

Roles

Security

Notifications

Email

Storage

System

Create professional settings UI.

==================================================

# 11. INSTRUCTOR / TUTOR APPLICATION

==================================================

Main route:

/instructor

---

## INSTRUCTOR SIDEBAR

Dashboard

My Courses

Students

Quizzes

Assignments

Announcements

Analytics

Profile

Settings

Logout

---

## INSTRUCTOR DASHBOARD

Display:

* Total courses
* Published courses
* Total students
* Active students
* Completion rate
* Average quiz score
* Pending assignments
* Recent activity

Charts:

Enrollment trend

Student progress

Course performance

Recent submissions.

---

## MY COURSES

Create:

Course grid/list toggle.

Course card:

Thumbnail

Title

Status

Students

Progress/completion

Updated date

Actions

Create Course button.

Filters:

All

Published

Draft

Archived

Search.

---

## CREATE COURSE

Create a professional multi-step course creation flow.

Step 1:

Basic information

Title

Description

Thumbnail

Category

Level

Language

Tags

Step 2:

Learning objectives

Requirements

Duration

Step 3:

Curriculum

Sections

Lessons

Step 4:

Pricing/status where applicable

Step 5:

Preview

Step 6:

Publish

Include:

Save draft

Cancel

Preview

Publish

Validation

Autosave indicator where appropriate.

---

## COURSE BUILDER

Create a professional course builder.

Structure:

Course

→ Section

→ Lesson

Lesson types:

Video

Text

PDF

Audio

Resource

Quiz

Assignment

Allow:

Drag/reorder

Add section

Add lesson

Edit

Duplicate

Delete

Publish/unpublish

---

## LESSON EDITOR

Create lesson editor.

Fields:

Lesson title

Description

Content

Video upload

File upload

Resources

Duration

Preview

Publish

Save draft

Include upload progress.

---

## QUIZ BUILDER

Create:

Quiz title

Instructions

Time limit

Passing score

Attempts

Questions

Question types

Marks

Answer options

Correct answer

Explanation

Reordering.

Quiz preview.

---

## ASSIGNMENT BUILDER

Create:

Title

Instructions

Resources

Deadline

Maximum marks

Allowed file types

Submission settings

Preview.

---

## STUDENT MANAGEMENT

Instructor student page.

Show:

Student

Course

Progress

Quiz score

Assignment status

Last activity

Completion

Student details.

---

## SUBMISSION GRADING

Create grading interface.

Show:

Student

Assignment

Submitted files

Submission date

Late indicator

Grade input

Maximum marks

Feedback

Return submission

Previous submissions.

---

## INSTRUCTOR ANALYTICS

Create:

Enrollment analytics

Completion analytics

Quiz performance

Assignment performance

Student engagement

Course performance

Date filters.

==================================================

# 12. STUDENT APPLICATION

==================================================

Main route:

/student

---

## STUDENT SIDEBAR

Dashboard

My Courses

Browse Courses

Assignments

Quizzes

Certificates

Notifications

Profile

Settings

Logout

---

## STUDENT DASHBOARD

Create a highly polished learning dashboard.

Hero:

"Continue Learning"

Show current course.

Include:

Course thumbnail

Current lesson

Progress

Continue button

Then:

My Courses

Upcoming assignments

Upcoming quizzes

Recent achievements

Certificates

Learning statistics

Recent activity.

---

## BROWSE COURSES

Create course discovery.

Search.

Filters:

Category

Level

Language

Duration

Rating

Free/Paid

Sort.

Course cards:

Thumbnail

Title

Instructor

Rating

Students

Duration

Level

Price/free

Enroll button.

---

## COURSE DETAILS

Create course detail page.

Hero:

Thumbnail

Title

Instructor

Rating

Students

Duration

Level

Description

Enroll/Continue button

Course content

Curriculum

Sections

Lessons

Learning objectives

Requirements

Instructor profile

Reviews where appropriate

FAQ where appropriate.

---

## LEARNING EXPERIENCE

Create the primary student learning screen.

Layout:

Sidebar:
Course curriculum

Main:
Video/content

Right/secondary:
Lesson information where appropriate

Show:

Course progress

Current section

Current lesson

Previous lesson

Next lesson

Mark complete

Resources

Notes area if supported

Discussion area if supported

The interface must be distraction-free.

---

## VIDEO LESSON

Include:

Video player

Play/pause

Progress

Volume

Fullscreen

Playback speed

Current lesson

Next lesson

Completion state.

---

## TEXT LESSON

Professional readable content layout.

Support:

Headings

Paragraphs

Images

Code blocks where relevant

Lists

Resources

Completion action.

---

## QUIZ EXPERIENCE

Create:

Quiz introduction

Instructions

Time limit

Question counter

Progress

Question

Answer options

Previous

Next

Flag question

Submit

Confirmation before submission.

Results:

Score

Percentage

Pass/fail

Correct/incorrect

Review

Retry where allowed.

---

## ASSIGNMENT EXPERIENCE

Show:

Instructions

Resources

Deadline

Submission status

Upload area

File list

Submit button

Replace submission

Submission confirmation

Grade

Instructor feedback

Late status.

---

## CERTIFICATES

Certificate gallery.

Each certificate:

Course

Student

Issue date

Certificate ID

View

Download

Share/verify.

Certificate preview must look professional and printable.

---

## NOTIFICATIONS

Notification center.

Show:

Unread

Read

Notification type

Time

Related item

Mark read

Mark all read.

---

## STUDENT PROFILE

Show:

Profile image

Name

Email

Bio

Phone

Learning statistics

Completed courses

Certificates

Achievements.

Editable settings.

==================================================

# 13. SHARED PAGES

==================================================

Create:

404 page

403 Forbidden page

500 error page

Network error state

Maintenance page

Session expired

Empty state

Search no-results state

Permission denied state

Loading state.

==================================================

# 14. IMPORTANT UI STATES

==================================================

Every major screen must have variants for:

Default

Loading

Empty

Error

Success

Disabled

Permission denied

No results

Saving

Saved

Deleting

Delete confirmation

Publishing

Published

Unpublishing

Archived

Uploading

Upload complete

Upload failed

==================================================

# 15. TABLE DESIGN

==================================================

Create a reusable data table.

Features:

* Search
* Filter
* Sort
* Pagination
* Row selection
* Bulk actions where appropriate
* Column actions
* Responsive behavior

Mobile version should not become unusable.

==================================================

# 16. MODALS AND CONFIRMATIONS

==================================================

Create confirmation dialogs for destructive actions.

Examples:

Delete course?

Archive course?

Deactivate user?

Delete assignment?

Publish course?

Submit quiz?

Submit assignment?

Each should explain the consequence clearly.

Buttons:

Cancel

Confirm

Loading state.

==================================================

# 17. TOASTS

==================================================

Create reusable toast designs:

Success

Error

Warning

Info

Examples:

"Course created successfully."

"Course published successfully."

"Enrollment completed."

"Assignment submitted."

"Unable to save changes."

==================================================

# 18. ACCESSIBILITY

==================================================

Design with accessibility in mind.

Ensure:

* Strong contrast
* Readable font sizes
* Clear focus states
* Visible keyboard navigation
* Accessible forms
* Clear error messages
* Icons have labels
* Do not rely solely on color
* Touch targets are sufficiently large

==================================================

# 19. RESPONSIVE MOBILE DESIGN

==================================================

Create mobile designs for the most important workflows.

Admin:

Dashboard

Users

Courses

User details

Instructor:

Dashboard

Courses

Course builder

Assignment grading

Student:

Dashboard

Course discovery

Course details

Learning

Quiz

Assignment

Certificate

Navigation must become a proper mobile navigation pattern.

==================================================

# 20. DARK MODE

==================================================

Create a complete dark mode version.

Do not simply invert colors.

Create proper dark surfaces, borders, text, cards, inputs, tables and charts.

==================================================

# 21. FIGMA ORGANIZATION

==================================================

Organize the Figma file professionally.

Pages:

01 — Design System

02 — Authentication

03 — Admin

04 — Instructor

05 — Student

06 — Shared Components

07 — Responsive

08 — Prototype Flows

Components should be reusable.

Use Auto Layout extensively.

Use components and variants.

Use consistent naming.

Use variables/design tokens where supported.

==================================================

# 22. COMPONENT NAMING

==================================================

Use clear component names.

Examples:

Button/Primary

Button/Secondary

Input/Text

Input/Password

Input/Search

Modal/Confirmation

Table/Data

Card/Course

Card/Stat

Navigation/Sidebar

Navigation/Header

Badge/Status

Progress/Course

Toast/Success

==================================================

# 23. PROTOTYPE FLOWS

==================================================

Create clickable prototype flows.

ADMIN:

Login
→ Admin dashboard
→ Users
→ User details
→ Courses
→ Course details
→ Reports

INSTRUCTOR:

Login
→ Instructor dashboard
→ My Courses
→ Create Course
→ Course Builder
→ Lesson Editor
→ Quiz Builder
→ Publish
→ Students
→ Grade Assignment

STUDENT:

Login
→ Student dashboard
→ Browse Courses
→ Course Details
→ Enroll
→ Learning
→ Lesson
→ Quiz
→ Assignment
→ Certificate

Interactions should represent realistic application behavior.

==================================================

# 24. REALISTIC CONTENT

==================================================

Use realistic LMS content.

Do not use:

Lorem ipsum

Fake meaningless numbers

Random placeholder names

"Sample text"

Instead use realistic:

Course names

Instructor names

Student names

Lesson titles

Quiz questions

Assignment names

Notifications

Analytics labels

Use enough realistic data to make the interface visually credible.

==================================================

# 25. VISUAL HIERARCHY

Every screen must clearly communicate:

What page am I on?

What is the primary task?

What information matters most?

What should I do next?

Use:

* Clear page titles
* Supporting descriptions
* Primary CTA
* Secondary actions
* Logical grouping
* Appropriate whitespace

==================================================

# 26. UX PRINCIPLES

Prioritize:

Clarity

Consistency

Efficiency

Feedback

Predictability

Accessibility

Discoverability

Error prevention

Recovery

Do not force users through unnecessary steps.

==================================================

# 27. ADMIN EXPERIENCE

Admin should feel operational and data-focused.

Prioritize:

Tables

Filters

Analytics

Bulk actions

Management workflows

System controls

==================================================

# 28. INSTRUCTOR EXPERIENCE

Instructor should feel content-creation focused.

Prioritize:

Course builder

Curriculum

Lessons

Quizzes

Assignments

Students

Analytics

==================================================

# 29. STUDENT EXPERIENCE

Student should feel learning-focused.

Prioritize:

Continue learning

Course discovery

Progress

Content

Quizzes

Assignments

Achievements

Certificates

==================================================

# 30. FINAL QUALITY REQUIREMENT

Do not create only attractive screens.

Create a complete product UI system.

Every major feature must have:

Screen

Components

Interactions

States

Responsive version

Error handling

Empty state

Loading state

Success state

Confirmation state where needed.

The design must be implementable in React without inventing missing UI.

==================================================

# FINAL OUTPUT

Generate the complete LMS UI/UX design.

The final design must cover:

ADMIN:

/lms/admin/*

INSTRUCTOR:

/instructor/*

STUDENT:

/student/*

Create a unified, professional design system across all three applications.

Make every page visually consistent.

Make every workflow logically connected.

Make the prototype navigable.

Use reusable components.

Use Auto Layout.

Use responsive layouts.

Use realistic content.

Use production-quality UX.

The final result should look like a polished commercial LMS product ready for React implementation, not a concept or wireframe.
