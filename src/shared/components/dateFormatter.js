export const dateFormater = (sDate, eDate, dateType = "") => {
  const urlParams = new URLSearchParams(window.location.search);
  const startDate = urlParams.get(sDate);
  const endDate = urlParams.get(eDate);

  let formattedStartDate;
  let formattedEndDate;

  // Format the date in "YYYY-MM-DD" format
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // ΑΝ ΔΕΝ ΥΠΑΡΧΕΙ ΣΤΟ URL STARTDATE ΚΑΙ ENDDATE TOTE
  if (!startDate || !endDate) {
    const today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (dateType === "DD-MM-YYYY") {
      const dateFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      formattedStartDate = firstDayOfMonth.toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      formattedEndDate = lastDayOfMonth.toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      // DD-MM-YYYY
      formattedStartDate = formattedStartDate.split("/").join("-");
      formattedEndDate = formattedEndDate.split("/").join("-");
    } else if (dateType === "YYYY-MM-DD") {
      // YYYY-MM-DD
      formattedStartDate = formatDate(firstDayOfMonth);
      formattedEndDate = formatDate(lastDayOfMonth);
    }
  } else {
    // ΑΝ ΥΠΑΡΧΕΙ STARTDATE KAI ENDDATE ΣΤΟ URL TOTE
    if (dateType === "DD-MM-YYYY") {
      const dateFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      formattedStartDate = new Date(startDate).toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      formattedEndDate = new Date(endDate).toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      // DD-MM-YYYY
      formattedStartDate = formattedStartDate.split("/").join("-");
      formattedEndDate = formattedEndDate.split("/").join("-");
    } else if (dateType === "YYYY-MM-DD") {
      const dateFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      formattedStartDate = new Date(startDate).toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      formattedEndDate = new Date(endDate).toLocaleDateString(
        "el-GR",
        dateFormatOptions
      );
      // YYYY-MM-DD
      formattedStartDate = formattedStartDate.split("/").reverse().join("-");
      formattedEndDate = formattedEndDate.split("/").reverse().join("-");
    }
  }

  return { formattedStartDate, formattedEndDate };
};
