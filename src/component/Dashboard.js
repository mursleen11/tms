import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Input, Card, message, Spin, Tag, DatePicker, Button, Select } from 'antd';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const DEFAULT_PROFILE_IMAGE = '/path/to/default-image.png';

function User() {
  const [searchResult, setSearchResult] = useState([]);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchFilters, setSearchFilters] = useState([]); 
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCategoryby, setselectedCategoryby] = useState('All');
  const [additionalCategories, setAdditionalCategories] = useState([]);
  const [isCategorySearchActive, setIsCategorySearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [id, setId] = useState();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ["Grammar", "SAVE A LIFE", "Cooperative Agreement", "Organization in preference",];
  const categoriesWithSubcategories = {
    "Sql": ["Data type", "Constraints"]
  };
  
  const keywords = ["Department of Marketing", " tutorialspoint.com", "interrelated", "equivalent", "gastrointestinal", "transfusion programme"];

  useEffect(() => {
    fetchUserData();
  }, []);

  
  

  const fetchUserData = async () => {
    setError(null);
    setLoading(true);
    setSearchType("");
    try {
      const response = await axios.get(`https://localhost:44343/api/Admin/ArticalList`);
      setData(response.data);
      console.log(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value) return;
    if (selectedCategoryby !== 'All') return; // Prevent search if category is not 'All'
  
    const data = { keyword: value, category: selectedCategoryby };debugger
    const url = `https://localhost:44343/api/Admin/SearchContent`;
  
    setLoading(true);
    setIsCategorySearchActive(false);
    try {
      const response = await axios.post(url, data);
  
      if (response.data && response.data.length > 0) {
        setFilteredData(response.data);
        const articleId = response.data[0]?.ID;
        setId(articleId);
  
        if (articleId) {
          fetchUserProfile(articleId);
        }
      } else {
        setFilteredData([]);
        setError('No results found');
      }
  
      setError(null);
    } catch (error) {
      setFilteredData([]);
      setError(error.response?.data?.message || 'Data not found!');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchUserProfile = async (articleId) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:44343/api/Admin/GetAuthorProfileWithImage/${articleId}`);
      
      if (response.data && response.data.AuthorProfile) {
        setAuthorProfile(response.data.AuthorProfile); // Store only the AuthorProfile
      } else {
        setAuthorProfile(DEFAULT_PROFILE_IMAGE); // Use default image if not found
      }

      setError(null);
    } catch (error) {
      setError('Failed to fetch author profile');
      setAuthorProfile(DEFAULT_PROFILE_IMAGE); // Set default image in case of error
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlphabetClick = async (letter) => {
    if (!letter) return;

    const data = { letter };
    const url = `https://localhost:44343/api/Admin/SearchByAlphabet`;

    setLoading(true);
    setIsCategorySearchActive(false); // Switch to category search mode
    setSearchType("alphabet"); 
    try {
      const response = await axios.post(url, data);

      if (response.data && response.data.length > 0) {
        setFilteredData(response.data);
        console.log(response);

        const articleId = response.data[0]?.ID;
        setId(articleId);

        if (articleId) {
          fetchUserProfile(articleId);
        }
      } else {
        setFilteredData([]);
        setError('No results found');
      }

      setError(null);
    } catch (error) {
      setFilteredData([]);
      setError(error.response?.data?.message || 'Data not found!');
     // message.error(error.message || 'Data submission failed!');
    } finally {
      setLoading(false);
    }
  };

const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("").map((letter) => (
    <a
      key={letter}
      style={{ padding: "5px", cursor: "pointer", fontWeight: "bold" }}
      onClick={() => handleAlphabetClick(letter)}  // Pass the clicked letter
    >
      {letter}
    </a>
));


  const handleWordClick = (word) => {
    navigate(`/search/${encodeURIComponent(word)}`); // Navigate to the new component
  };

  const handleReadMoreClick = (articleId) => {
    setSelectedArticleId(articleId);
  };

  const highlightAndLinkKeywords = (text) => {
    if (!text) return text;
    
    let parts = [];
    let lastIndex = 0;

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        parts.push(text.substring(lastIndex, match.index));
        parts.push(
          <a
            key={match.index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleWordClick(keyword);
            }}
            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {match[0]}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
    });

    parts.push(text.substring(lastIndex));
    return parts;
  };

  
  const renderSearchTitle = () => {
    switch (searchType) {
      case "category":
        return 'Search by Categories';
      case "alphabet":
        return 'Browse Definitions by Alphabet';
      default:
        return null;  // No title for simple search
    }
  };

  const handleCategoryClick = async (key) => {
    setSelectedCategory(key);debugger
    if (!key) return;
  
    const data = { keyword: key }; 
    const url = `https://localhost:44343/api/Admin/SearchContent`;
  
    setLoading(true);
    setSearchType("category");  
    try {
      const response = await axios.post(url, data);
  
      if (response.data && response.data.length > 0) {
        setSearchResult(response.data); // Set the searchResult state
        setFilteredData(response.data); // Set the initial filtered data
        setIsCategorySearchActive(true); // Enable category search input when results are found
  
        const articleId = response.data[0]?.ID;
        setId(articleId);
  
        if (articleId) {
          fetchUserProfile(articleId);
        }
      } else {
        setSearchResult([]);
        setFilteredData([]);
        setError('No results found');
        setIsCategorySearchActive(false); // Disable category search if no results
      }
  
      setError(null);
    } catch (error) {
      setSearchResult([]);
      setFilteredData([]);
      setError(error.response?.data?.message || 'Data submission failed!');
      message.error(error.message || 'Data submission failed!');
      setIsCategorySearchActive(false); // Disable category search on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleTagSearch = async (value) => {
    if (!value) return;
    setSelectedCategory(value);
  
    const data = { keyword: value };debugger
    const url = `https://localhost:44343/api/Admin/SearchContent`;
  
    setLoading(true);
    setSearchType("");
    setIsCategorySearchActive(true);
    try {
      const response = await axios.post(url, data);
  
      if (response.data && response.data.length > 0) {
        // Filter data where the Tags field contains the search keyword
        const filteredData = response.data.filter(item => 
          item.Tags && item.Tags.toLowerCase().includes(value.toLowerCase())
        );
  
        if (filteredData.length > 0) {
          setFilteredData(filteredData);
          console.log(response);
  
          const articleId = filteredData[0]?.ID;
          setId(articleId);
  
          if (articleId) {
            fetchUserProfile(articleId);
          }
        } else {
          setFilteredData([]);
          setError('No matching tags found');
        }
      } else {
        setFilteredData([]);
        setError('No results found');
      }
  
      setError(null);
    } catch (error) {
      setFilteredData([]);
      setError(error.response?.data?.message || 'Data submission failed!');
      message.error(error.message || 'Data submission failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {
    const questionMap = {
      '1': 'What is impedance?',
      '2': 'What is NoSQL',
      '3': 'What is IFS AB?',
      '4': 'What is a data fabric?',
      '5': 'What is Salesforce Developer Experience (Salesforce DX)?',
      '6': 'What is secure multiparty computation (SMPC)',
      '7': 'What is Salesforce Platform (formerly Force.com)?',
    };

    const keyword = questionMap[e.key];
    if (keyword) {
      navigate(`/search/${encodeURIComponent(keyword)}`);
    }
  };
  
  const handleMenuClickSearch = async (value) => {
    if (!value || !selectedOption) {
      message.error("Please provide a valid search value.");debugger
      return;
    }

    // Find matching items in the fetched data
    const matchedItem = data.find((item) => {
      const isArticalMatch = selectedOption === 'ArticalName' && item.ArticalName && item.ArticalName.toLowerCase().includes(value.toLowerCase());
      const isAuthorMatch = selectedOption === 'AuthorName' && item.Author && item.Author.toLowerCase().includes(value.toLowerCase());
      const isDateMatch = selectedOption === 'Date' && item.Date && item.Date.includes(value);
      const isTagsMatch = selectedOption === 'Tags' && item.Tags && item.Tags.toLowerCase().includes(value.toLowerCase());

      return isArticalMatch || isAuthorMatch || isDateMatch || isTagsMatch;
    });

    if (matchedItem) {
      // If a match is found, use the matched item's ID for further search (if needed)
      const matchedId = matchedItem.ID;

      // Fetch additional data based on the matched ID
      await fetchDataById(matchedId);

      // Append the new search filter to the searchFilters array
      setSearchFilters(prevFilters => [
        ...prevFilters,
        { option: selectedOption, value }
      ]);

      message.success('Search results found!');
    } else {
      setFilteredData([]);
      setError('No matching results found');
      message.error('No matching results found');
    }
  };

  
  const fetchDataById = async (id) => {
    const url = `https://localhost:44343/api/Admin/List/${id}`;
    setLoading(true);

    try {
      const response = await axios.get(url);
      if (response.data) {
        setFilteredData([response.data]); // Set fetched data based on the matched ID
      }
    } catch (error) {
      setFilteredData([]);
      setError('Failed to fetch data by ID');
      message.error('Failed to fetch data by ID');
    } finally {
      setLoading(false);
    }
  };
  
const removeFilter = (filterToRemove) => {
  setSearchFilters((prevFilters) =>
    prevFilters.filter((filter) => filter !== filterToRemove)
  );
  if (searchFilters.length === 1) {
    setFilteredData([]); // Reset the filtered data when all filters are removed
  }
};

const handleSearchall = () => {
  if (!keyword) return;

  if (selectedCategoryby === 'All') {
    handleSearch(keyword);debugger
  } else if (selectedCategoryby === 'byCategory') {
    handleTagSearch(keyword);
  }
};

const onMenuClick = ({ key }) => {
  // Handle subcategory click
  if (key.startsWith('subcategory-')) {
    // Extract and set the selected subcategory
    const subcategory = key.replace('subcategory-', '');
    setSelectedSubcategory(subcategory);
    handleTagSearch(subcategory);
  }
};

const onCategoryTitleClick = (category) => {
  // Update state to indicate category search is active
  setSelectedSubcategory(null);
  setAdditionalCategories([]);
  // Fetch or filter data based on the category
  handleCategoryClick(category);
};

const handleCategorySearch = (value) => {
  setSearchText(value);debugger

  if (value.trim() === '') {
    setFilteredData(searchResult); // Reset to original results if search term is empty
  } else {
    const lowercasedValue = value.toLowerCase();
    const filtered = searchResult.filter(item =>
      item.Content && item.Content.toLowerCase().includes(lowercasedValue)
    );

    // Update filtered data with content starting from search term
    const updatedFiltered = filtered.map(item => {
      const index = item.Content.toLowerCase().indexOf(lowercasedValue);
      if (index === -1) return { ...item, Content: '' };
      return {
        ...item,
        Content: item.Content.substring(index) // Show content starting from search term
      };
    });

    // Sort results to show items where the search term is at the beginning
    const sorted = updatedFiltered.sort((a, b) => {
      const aIndex = a.Content.toLowerCase().indexOf(lowercasedValue);
      const bIndex = b.Content.toLowerCase().indexOf(lowercasedValue);
      
      if (aIndex === 0 && bIndex !== 0) return -1;
      if (aIndex !== 0 && bIndex === 0) return 1;
      return aIndex - bIndex;
    });

    setFilteredData(sorted);
  }
};

  return (
    <Layout>
      <Header style={{ background: 'white', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={require('./image/tmsLogo-removebg-preview.png')} className='logo' alt=""
        style={{width: '80px', height: '80px'}} />
          <Menu mode="horizontal" theme="dark" style={{ lineHeight: '64px' }}>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/signup">Register</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Layout>
      <Sider width={300} className="site-layout-background" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'white' }}>
  <div style={{ flex: '1', overflowY: 'auto' }}>
    <hr />
    <Menu
      mode="inline"
      style={{ borderRight: 0, textAlign: 'left', height: '100%' }}
      onClick={({ key }) => handleCategoryClick(key)}
    >
      <h1 style={{paddingLeft: '20px'}}>Categories</h1>
      <hr />
      {categories.map(category => (
        <Menu.Item key={category}>{category}</Menu.Item>
      ))}
    </Menu>
    <Menu
      mode="inline"
      style={{ borderRight: 0, textAlign: 'left', height: '100%' }}
      onClick={onMenuClick} // Handle subcategory clicks
    >
      {Object.entries(categoriesWithSubcategories).map(([category, subcategories]) => (
        <Menu.SubMenu
          key={`category-${category}`}
          title={category}
          onTitleClick={() => onCategoryTitleClick(category)} // Call handleTagSearch when category is clicked
        >
          {subcategories.map(subcategory => (
            <Menu.Item key={`subcategory-${subcategory}`}>
              {subcategory}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ))}
    </Menu>
    <hr />
  </div>

  <div>
      {!isCategorySearchActive ? (
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0, textAlign: 'left' }}
          onClick={handleMenuClick}
        >
          <Menu.Item key="0" style={{fontSize: '20px', fontWeight: 'bold'}}>Network Questions</Menu.Item>
          <Menu.Item key="1">What is impedance?</Menu.Item>
          <Menu.Item key="2">What is NoSQL (Not Only SQL database)?</Menu.Item>
          <Menu.Item key="3">What is IFS AB?</Menu.Item>
          <Menu.Item key="4">What is a data fabric?</Menu.Item>
          <Menu.Item key="5">What is a software license?</Menu.Item>
          
        </Menu>
      ) : (
        <Menu mode="vertical" style={{ textAlign: 'left' }}>
          <Menu.Item key="0" style={{fontSize: '20px', fontWeight: 'bold'}}>Advance Search</Menu.Item> <hr />
          <Menu.Item key="ArticalName" onClick={() => setSelectedOption('ArticalName')}>Artical Name</Menu.Item>
          {selectedOption === 'ArticalName' && (
            <Search
              placeholder="Search Artical Name"
              style={{ width: 200 }}
              onSearch={handleMenuClickSearch}
              loading={loading}
            />
          )}

          <Menu.Item key="AuthorName" onClick={() => setSelectedOption('AuthorName')}>Author Name</Menu.Item>
          {selectedOption === 'AuthorName' && (
            <Search
              placeholder="Search Author Name"
              style={{ width: 200 }}
              onSearch={handleMenuClickSearch}
              loading={loading} />
          )}

          <Menu.Item key="Date" onClick={() => setSelectedOption('Date')}>Date</Menu.Item>
          {selectedOption === 'Date' && (
            <DatePicker
              placeholder="Select Date"
              style={{ width: 200 }}
              onChange={(date, dateString) => handleMenuClickSearch(dateString)}/>
          )}

          <Menu.Item key="Tags" onClick={() => setSelectedOption('Tags')}>Tags</Menu.Item>
          {selectedOption === 'Tags' && (
            <Search
              placeholder="Search Tags"
              style={{ width: 200 }}
              onSearch={handleMenuClickSearch}
              loading={loading}/>
          )}
        </Menu>
      )}
       </div><hr />
  {/* Tags Section (50% Height) */}
        <div style={{ flex: '1', padding: '10px', overflowY: 'auto', backgroundColor: '#fff' }}>
        <h3>Recent Tags</h3>

                  <Tag style={{ backgroundColor: '#fff', }} onClick={() => handleTagSearch('circumstantial')}>Circumstantial</Tag>
                  <Tag  style={{ backgroundColor: '#fff',  }} onClick={() => handleTagSearch('programme')}>Programme</Tag>
                  <br /><br />
                  <Tag style={{ backgroundColor: '#fff',  }} onClick={() => handleTagSearch('Module')}>Module</Tag>
                  <Tag  style={{ backgroundColor: '#fff',  }} onClick={() => handleTagSearch('Excu')}>Excu</Tag>
                  <Tag style={{ backgroundColor: '#fff',  }}  onClick={() => handleTagSearch('Donate')}> Donate</Tag>
                  <br /><br />
                  <Tag  style={{ backgroundColor: '#fff',  }} onClick={() => handleTagSearch('Tips')}>Tips</Tag>
                  <Tag   style={{ backgroundColor: '#fff', }} onClick={() => handleTagSearch('Voluntary')}>Voluntary </Tag>
                  <Tag style={{ backgroundColor: '#fff', }} onClick={() => handleTagSearch('gastrointestinal')}> Gastrointestinal</Tag>
      </div><hr />
       

</Sider>


        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Select defaultValue="All" style={{ width: 120, marginRight: 10 }}
                  onChange={(value) => {  setselectedCategoryby(value); }}>
                  <Option value="All">All</Option>
                  <Option value="byCategory">AllCategory</Option>
              </Select>
              <Search
                placeholder="Enter keyword and Search..."
                style={{ width: 300 }}
                enterButton="Search"
                value={keyword}
                onSearch={handleSearchall} 
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            {isCategorySearchActive && (
                  <Input
                    style={{ width: '20%' }}
                    placeholder="Search content..."
                    value={searchText}
                    onChange={(e) => handleCategorySearch(e.target.value)}
                  />
                )}
          </div>
          <div>
                
              </div>

            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <p>Browse by Alphabet: {alphabetList}</p>
            </div>
            {renderSearchTitle() && (
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <h2>{renderSearchTitle()}</h2>
              </div>
            )}
                {/* Display search filter buttons */}
              {searchFilters.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  {searchFilters.map((filter, index) => (
                    <Button
                      key={index}
                      type="primary"
                      onClick={() => removeFilter(filter)}
                      icon={<CloseOutlined />}
                      style={{ marginRight: 10 }}
                    >
                      {`${filter.option}: ${filter.value}`}
                    </Button>
                  ))}
                </div>
              )}
            <hr />
            <Card
              title="Search Results"
              bordered={true}
              >
               
                    {isCategorySearchActive && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  {selectedCategory && <p>{selectedCategory}</p>}

                  {/* Display selectedSubcategory only if it's unique */}
                  {selectedSubcategory && selectedSubcategory !== selectedCategory && (
                    <p>{selectedSubcategory}</p>
                  )}

                  {/* Filter duplicates in additionalCategories */}
                  {additionalCategories.length > 0 && (
                    <div>
                      {[...new Set(additionalCategories)].map((category, index) => (
                        <p key={index}>{category}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}


                {loading ? (
                  <Spin />
                ) : (
                  filteredData.length > 0 ? (
                    filteredData.map(({ ID, Content, ArticalName, Author, Date, Tags }) => (
                      <div key={ID} style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ flexShrink: 0, marginRight: '20px' }}>
                            <img src={authorProfile || DEFAULT_PROFILE_IMAGE} alt="Author"
                              style={{ width: '70px', height: '70px', objectFit: 'cover' }}/>
                          </div>
                          <div>
                            <Title level={4} style={{ marginBottom: '5px', textAlign: 'left' }}>
                              <a href="#"onClick={(e) => { e.preventDefault(); handleReadMoreClick(ID); }}>
                                {ArticalName}
                              </a>
                            </Title>
                            <p>{Author}</p>
                            <p>{moment(Date).format('MMMM Do YYYY')}</p>
                           {/*  <p>{Tags}</p> */}
                          </div>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                      {ID === selectedArticleId ? (
                        highlightAndLinkKeywords(Content)
                      ) : (
                        highlightAndLinkKeywords(Content.length > 200 ? Content.slice(0, 200) + '...' : Content)
                      )}
                      {Content.length > 200 && ID === selectedArticleId && (
                        <Button type="link" onClick={() => handleReadMoreClick(null)}>
                          Show Less
                        </Button>
                      )}
                      {Content.length > 200 && ID !== selectedArticleId && (
                        <a href="#" onClick={() => handleReadMoreClick(ID)}>Read More</a>
                      )}
                    </div>
                      </div>
                    ))
                  ) : (
                    <div>No results found.</div>
                  )
                )}
           </Card>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Dashboard ©2024 Created by Agilitize</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default User;
