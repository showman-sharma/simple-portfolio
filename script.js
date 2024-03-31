const projects = [
    {
      "title": "SKY-WRITE-2.0",
      "description": "This project creates an environment to write in the air. No special pen/tools. Just a camera and the user’s hand.",
      "githubLink": "https://github.com/showman-sharma/sky-write-2.0",
      "demoLink": "https://youtu.be/5FtQ17qnpa0"
    },
    {
      "title": "RED LIGHT GREEN LIGHT",
      "description": "A computer-based version of the iconic game as seen in the Netflix series: Squid Game, created using OpenCV.",
      "githubLink": "https://github.com/showman-sharma/red-light-green-light",
      "demoLink": "https://youtu.be/WMmskDZWDMI"
    },
    {
      "title": "Melanoma Detection using CNN",
      "description": "Melanoma is a type of cancer that can be deadly if not detected early. A solution which can evaluate images and alert the dermatologists about the presence of melanoma has the potential to reduce a lot of manual effort needed in diagnosis. In this project, we use CNN based models that take images of malignant and benign oncological diseases and classify them into 9 classes of different diseases and cancers.",
      "githubLink": "https://github.com/showman-sharma/Melanoma_Detection_CNN",
      "demoLink": ""
    },
    {
      "title": "InformationRetreival",
      "description": "For any given query, an Information Retrieval (IR) system is used to obtain and rank relevant word documents from the data collection of interest. The most basic IR system uses Term Frequency Inverse Document Frequency (TF-IDF) to represent documents and queries as vectors, and then uses measures like cosine similarity to assess the relevance of a query to all the documents in the dataset. This TF-IDF based Vector Space Model (VSM) performs admirably, but it has a few flaws, such as the assumption that the words are semantically unrelated, necessitating the development of alternate IR approaches. The NLP community has spent a lot of time looking into ways to capture semantic relatedness in words and documents. Data-driven learning of vector representations from a big corpus is one of the most common ways.",
      "githubLink": "https://github.com/showman-sharma/InformationRetreival",
      "demoLink": ""
    },
    {
      "title": "HANDYMAN CHATBOT",
      "description": "This is a basic chatbot for Handyman Prosthetic, an arm prosthetics company. Handy is a chatbot trained using deep learning on text data, with a limited response set.",
      "githubLink": "https://github.com/showman-sharma/handyman-chatbot",
      "demoLink": "https://youtu.be/Gxjvg8khrUM"
    },
    {
      "title": "Shortest Route using Semi Bandit Algorithms",
      "description": "We show performance of various algorithms in semi-bandit setting and try to solve a real word problem of shortest route using the same.",
      "githubLink": "https://github.com/showman-sharma/Semi-bandits",
      "demoLink": ""
    },
    {
      "title": "Taxi Problem: Shortest Pickup-Drop Route",
      "description": "In this project, we tried two different Learning Algorithms for Hierarchical RL on the Taxi-v3 environment from OpenAI gym. SMDP Q-Learning and Intra Option Q-Learning and contrasted them with two other methods that involve hardcoding based on human understanding. We conclude that the solutions learnt by machine are way superior than humans for this problem. Intra Option Q-Learning outperforms SMDP Q-Learning because of better usage of the SARS samples (similar to experience replay). Our algorithms even outperform the Hardcoded Agent. We also demonstrated and concluded the strong effectiveness of state compression on the model performance.",
      "githubLink": "https://github.com/showman-sharma/taxi-v3-learning",
      "demoLink": ""
    },
    {
      "title": "Project B-Eagle",
      "description": "As gas is going to become an important source of power as the world moves towards a cleaner future, more and more processes & systems will be powered by CNG, LPG, methane and even hydrogen. Along with this, a variety of gases are already in use in the industrial & production sector. As these gases are mostly hazardous or inflammable, in this paper we have suggested an IOT-based gas leakage detection system which monitors concentration of some target gas in a space, finds the source and reports it to prevent accidents. We have done a thorough analysis of the problem, and suggested multiple solutions for different cases & different scales. We propose a leak source search system mounted on small sized drones or rovers that will accurately reach the source of the gas leak or fire. Subsequently, the drone/rover might act as a beacon locating the source exactly or could manage the hazard if relevantly equipped. Here, we try: To create a Gas Leak Source Search System. To equip a drone with this system and make it reach the source. This drone would act like a beacon, informing the user about the exact location of the source.",
      "githubLink": "https://github.com/showman-sharma/project-B-EAGLE",
      "demoLink": ""
    },
    {
      "title": "Pulse Oximeter using Smartphone Camera",
      "description": "In this project, we use a smartphone to calculate the pulse of a user. The user is expected to press his/her thumb over the smartphone camera with the flash on. We use this footage to calculate pulse by applying various filtering techniques.",
      "githubLink": "https://github.com/showman-sharma/pulseOximeter",
      "demoLink": ""
    },
    {
      "title": "Housing Price Analysis Using Regularized Linear Regression",
      "description": "We are required to build a regression model using regularisation in order to predict the actual value of the prospective properties and decide whether to invest in them or not. We try to answer the following questions from our analysis: Which variables are significant in predicting the price of a house, and How well those variables describe the price of a house.",
      "githubLink": "https://github.com/showman-sharma/Housing-Price-Analysis",
      "demoLink": ""
    },
    {
      "title": "Lending Club Case study",
      "description": "In this project, we analyse the impact of various factors on loan repayment defaulting. Exploratory data analysis was performed and observations were drawn, providing suggestions to minimize risk and loss. We use EDA techniques like Univariate analysis, Bivariate analysis, Bayesian analysis and time series analysis In this case study, we will use EDA to understand how consumer attributes and loan attributes influence the tendency of default. Our dataset contains the complete loan data for all loans issued through the time period 2007 t0 2011.",
      "githubLink": "https://github.com/showman-sharma/LendingClubCaseStudy",
      "demoLink": ""
    }
  ];
  
  
document.addEventListener("DOMContentLoaded", function() {
    const projectsContainer = document.getElementById("projects-container");
  
    projects.forEach(project => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");
  
      const titleElement = document.createElement("h3");
      titleElement.textContent = project.title;
  
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = project.description;
  
      const githubLinkElement = document.createElement("a");
      githubLinkElement.textContent = "View Code";
      githubLinkElement.href = project.githubLink;
      githubLinkElement.target = "_blank";
  
      const demoLinkElement = document.createElement("a");
      if (project.demoLink !== "") {
        demoLinkElement.textContent = "View Demo";
        demoLinkElement.href = project.demoLink;
        demoLinkElement.target = "_blank";
        demoLinkElement.style.marginLeft = "10px"; // Adding margin between links
      } else {
        demoLinkElement.textContent = "";
      }
  
      projectDiv.appendChild(titleElement);
      projectDiv.appendChild(descriptionElement);
      projectDiv.appendChild(githubLinkElement);
      projectDiv.appendChild(demoLinkElement);
  
      projectsContainer.appendChild(projectDiv);
    });
  });