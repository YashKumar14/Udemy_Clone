import axios from "axios";

export const fetchCourseData = () => {
  const courseQueryParams = {
    "fields[course]": [
      "@default",
      "num_subscribers",
      "headline",
      "num_reviews",
      "rating",
      "image_100x100",
    ].join(","),
    filter_hq_courses: true,
    ordering: "lang,-course_performance__revenue_30days",
    page: 1,
    page_size: 200,
  };

  const courseDetails = async (courseId, courseInstructorId) => {
    try {
      const response = await axios.get(
        `https://www.udemy.com/api-2.0/users/${courseInstructorId}/taught-courses/`,
        {
          params: courseQueryParams,
        }
      );

      console.log("courseData:::", response.data);

      const courseCount = response.data.count;
      console.log("courseId:::", courseId);
      console.log("InstructorID::", courseInstructorId);

      const courseData = response.data.results.find(
        (item) => item.id === Number(courseId)
      );
      console.log(courseData);
      return { courseCount, courseData };
    } catch (error) {
      console.error("Error while fetching course instructor api:", error);
    }
  };

  return {
    courseDetails,
  };
};
