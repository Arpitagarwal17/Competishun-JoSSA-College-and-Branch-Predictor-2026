export type HomeStateOption = {
  value: string;
  label: string;
};

export const HOME_STATE_OPTIONS: HomeStateOption[] = [
  { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "Delhi", label: "Delhi" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" }
];

const SPECIAL_HOME_STATE_QUOTAS: Record<string, string> = {
  Goa: "GO",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA"
};

const INSTITUTE_HOME_STATES: Record<string, string> = {
  "Assam University, Silchar": "Assam",
  "Atal Bihari Vajpayee Indian Institute of Information Technology & Management Gwalior": "Madhya Pradesh",
  "Birla Institute of Technology, Deoghar Off-Campus": "Jharkhand",
  "Birla Institute of Technology, Mesra, Ranchi": "Jharkhand",
  "Birla Institute of Technology, Patna Off-Campus": "Bihar",
  "Central institute of Technology Kokrajar, Assam": "Assam",
  "Central University of Haryana": "Haryana",
  "Central University of Jammu": "Jammu and Kashmir",
  "Central University of Rajasthan, Rajasthan": "Rajasthan",
  "Chhattisgarh Swami Vivekanada Technical University, Bhilai (CSVTU Bhilai)": "Chhattisgarh",
  "CU Jharkhand": "Jharkhand",
  "Dr. B R Ambedkar National Institute of Technology, Jalandhar": "Punjab",
  "Gati Shakti Vishwavidyalaya, Vadodara": "Gujarat",
  "Ghani Khan Choudhary Institute of Engineering and Technology, Malda, West Bengal": "West Bengal",
  "Gurukula Kangri Vishwavidyalaya, Haridwar": "Uttarakhand",
  "Indian Institute of Carpet Technology, Bhadohi": "Uttar Pradesh",
  "Indian Institute of Engineering Science and Technology, Shibpur": "West Bengal",
  "Indian Institute of Handloom Technology, Salem": "Tamil Nadu",
  "Indian Institute of Handloom Technology(IIHT), Varanasi": "Uttar Pradesh",
  "Indian Institute of Information Technology (IIIT) Nagpur": "Maharashtra",
  "Indian Institute of Information Technology (IIIT) Pune": "Maharashtra",
  "Indian Institute of Information Technology (IIIT) Ranchi": "Jharkhand",
  "Indian Institute of Information Technology (IIIT), Sri City, Chittoor": "Andhra Pradesh",
  "Indian Institute of Information Technology (IIIT)Kota, Rajasthan": "Rajasthan",
  "Indian Institute of Information Technology Bhagalpur": "Bihar",
  "Indian Institute of Information Technology Bhopal": "Madhya Pradesh",
  "Indian Institute of Information Technology Design & Manufacturing Kurnool, Andhra Pradesh": "Andhra Pradesh",
  "Indian Institute of Information Technology Guwahati": "Assam",
  "Indian Institute of Information Technology Lucknow": "Uttar Pradesh",
  "INDIAN INSTITUTE OF INFORMATION TECHNOLOGY SENAPATI MANIPUR": "Manipur",
  "Indian Institute of Information Technology Surat": "Gujarat",
  "Indian Institute of Information Technology Tiruchirappalli": "Tamil Nadu",
  "Indian Institute of Information Technology, Agartala": "Tripura",
  "Indian Institute of Information Technology, Allahabad": "Uttar Pradesh",
  "Indian Institute of Information Technology, Design & Manufacturing, Kancheepuram": "Tamil Nadu",
  "Indian institute of information technology, Raichur, Karnataka": "Karnataka",
  "Indian Institute of Information Technology, Vadodara International Campus Diu (IIITVICD)": "Dadra and Nagar Haveli and Daman and Diu",
  "Indian Institute of Information Technology(IIIT) Dharwad": "Karnataka",
  "Indian Institute of Information Technology(IIIT) Kalyani, West Bengal": "West Bengal",
  "Indian Institute of Information Technology(IIIT) Kilohrad, Sonepat, Haryana": "Haryana",
  "Indian Institute of Information Technology(IIIT) Kottayam": "Kerala",
  "Indian Institute of Information Technology(IIIT) Una, Himachal Pradesh": "Himachal Pradesh",
  "Indian Institute of Information Technology(IIIT), Vadodara, Gujrat": "Gujarat",
  "Indian Institute of Technology (BHU) Varanasi": "Uttar Pradesh",
  "Indian Institute of Technology (ISM) Dhanbad": "Jharkhand",
  "Indian Institute of Technology Bhilai": "Chhattisgarh",
  "Indian Institute of Technology Bhubaneswar": "Odisha",
  "Indian Institute of Technology Bombay": "Maharashtra",
  "Indian Institute of Technology Delhi": "Delhi",
  "Indian Institute of Technology Dharwad": "Karnataka",
  "Indian Institute of Technology Gandhinagar": "Gujarat",
  "Indian Institute of Technology Goa": "Goa",
  "Indian Institute of Technology Guwahati": "Assam",
  "Indian Institute of Technology Hyderabad": "Telangana",
  "Indian Institute of Technology Indore": "Madhya Pradesh",
  "Indian Institute of Technology Jammu": "Jammu and Kashmir",
  "Indian Institute of Technology Jodhpur": "Rajasthan",
  "Indian Institute of Technology Kanpur": "Uttar Pradesh",
  "Indian Institute of Technology Kharagpur": "West Bengal",
  "Indian Institute of Technology Madras": "Tamil Nadu",
  "Indian Institute of Technology Mandi": "Himachal Pradesh",
  "Indian Institute of Technology Palakkad": "Kerala",
  "Indian Institute of Technology Patna": "Bihar",
  "Indian Institute of Technology Roorkee": "Uttarakhand",
  "Indian Institute of Technology Ropar": "Punjab",
  "Indian Institute of Technology Tirupati": "Andhra Pradesh",
  "Institute of Chemical Technology, Mumbai: Indian Oil Odisha Campus, Bhubaneswar": "Odisha",
  "Institute of Engineering and Technology, Dr. H. S. Gour University. Sagar (A Central University)": "Madhya Pradesh",
  "Institute of Infrastructure, Technology, Research and Management-Ahmedabad": "Gujarat",
  "International Institute of Information Technology, Bhubaneswar": "Odisha",
  "International Institute of Information Technology, Naya Raipur": "Chhattisgarh",
  "Islamic University of Science and Technology Kashmir": "Jammu and Kashmir",
  "J.K. Institute of Applied Physics & Technology, Department of Electronics & Communication, University of Allahabad- Allahabad": "Uttar Pradesh",
  "Jawaharlal Nehru University, Delhi": "Delhi",
  "Malaviya National Institute of Technology Jaipur": "Rajasthan",
  "Maulana Azad National Institute of Technology Bhopal": "Madhya Pradesh",
  "Mizoram University, Aizawl": "Mizoram",
  "Motilal Nehru National Institute of Technology Allahabad": "Uttar Pradesh",
  "National Institute of Advanced Manufacturing Technology, Ranchi": "Jharkhand",
  "National Institute of Electronics and Information Technology, Ajmer (Rajasthan)": "Rajasthan",
  "National Institute of Electronics and Information Technology, Aurangabad (Maharashtra)": "Maharashtra",
  "National Institute of Electronics and Information Technology, Gorakhpur (UP)": "Uttar Pradesh",
  "National Institute of Electronics and Information Technology, Patna (Bihar)": "Bihar",
  "National Institute of Electronics and Information Technology, Ropar (Punjab)": "Punjab",
  "National Institute of Food Technology Entrepreneurship and Management, Kundli": "Haryana",
  "National Institute of Food Technology Entrepreneurship and Management, Thanjavur": "Tamil Nadu",
  "National Institute of Technology Agartala": "Tripura",
  "National Institute of Technology Arunachal Pradesh": "Arunachal Pradesh",
  "National Institute of Technology Calicut": "Kerala",
  "National Institute of Technology Delhi": "Delhi",
  "National Institute of Technology Durgapur": "West Bengal",
  "National Institute of Technology Goa": "Goa",
  "National Institute of Technology Hamirpur": "Himachal Pradesh",
  "National Institute of Technology Karnataka, Surathkal": "Karnataka",
  "National Institute of Technology Meghalaya": "Meghalaya",
  "National Institute of Technology Nagaland": "Nagaland",
  "National Institute of Technology Patna": "Bihar",
  "National Institute of Technology Puducherry": "Puducherry",
  "National Institute of Technology Raipur": "Chhattisgarh",
  "National Institute of Technology Sikkim": "Sikkim",
  "National Institute of Technology, Andhra Pradesh": "Andhra Pradesh",
  "National Institute of Technology, Jamshedpur": "Jharkhand",
  "National Institute of Technology, Kurukshetra": "Haryana",
  "National Institute of Technology, Manipur": "Manipur",
  "National Institute of Technology, Mizoram": "Mizoram",
  "National Institute of Technology, Rourkela": "Odisha",
  "National Institute of Technology, Silchar": "Assam",
  "National Institute of Technology, Srinagar": "Jammu and Kashmir",
  "National Institute of Technology, Tiruchirappalli": "Tamil Nadu",
  "National Institute of Technology, Uttarakhand": "Uttarakhand",
  "National Institute of Technology, Warangal": "Telangana",
  "North Eastern Regional Institute of Science and Technology, Nirjuli-791109 (Itanagar),Arunachal Pradesh": "Arunachal Pradesh",
  "North-Eastern Hill University, Shillong": "Meghalaya",
  "Puducherry Technological University, Puducherry": "Puducherry",
  "Punjab Engineering College, Chandigarh": "Chandigarh",
  "Pt. Dwarka Prasad Mishra Indian Institute of Information Technology, Design & Manufacture Jabalpur": "Madhya Pradesh",
  "Rajiv Gandhi National Aviation University, Fursatganj, Amethi (UP)": "Uttar Pradesh",
  "Sant Longowal Institute of Engineering and Technology": "Punjab",
  "Sardar Vallabhbhai National Institute of Technology, Surat": "Gujarat",
  "School of Engineering, Tezpur University, Napaam, Tezpur": "Assam",
  "School of Planning & Architecture, Bhopal": "Madhya Pradesh",
  "School of Planning & Architecture, New Delhi": "Delhi",
  "School of Planning & Architecture: Vijayawada": "Andhra Pradesh",
  "School of Studies of Engineering and Technology, Guru Ghasidas Vishwavidyalaya, Bilaspur": "Chhattisgarh",
  "Shri G. S. Institute of Technology and Science Indore": "Madhya Pradesh",
  "Shri Mata Vaishno Devi University, Katra, Jammu & Kashmir": "Jammu and Kashmir",
  "University of Hyderabad": "Telangana",
  "Visvesvaraya National Institute of Technology, Nagpur": "Maharashtra"
};

export function getHomeStateLabel(value: string) {
  return HOME_STATE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getInstituteHomeState(institute: string) {
  return INSTITUTE_HOME_STATES[institute] ?? null;
}

export function isQuotaAllowedForHomeState(row: { institute: string; quota: string }, homeState: string) {
  if (!homeState) {
    return true;
  }

  if (row.quota === "AI") {
    return true;
  }

  const specialQuota = SPECIAL_HOME_STATE_QUOTAS[homeState];
  if (specialQuota && row.quota === specialQuota) {
    return true;
  }

  if (row.quota !== "HS" && row.quota !== "OS") {
    return false;
  }

  const instituteState = getInstituteHomeState(row.institute);
  if (!instituteState) {
    return true;
  }

  if (row.quota === "HS") {
    return instituteState === homeState;
  }

  return instituteState !== homeState;
}
