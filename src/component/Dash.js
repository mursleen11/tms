import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Input, Card, message, Spin, Tag, DatePicker, Button, Select } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  TagOutlined,
  SearchOutlined,
  FileTextOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from "axios";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Header, Sider, Content } = Layout;
const DEFAULT_PROFILE_IMAGE = '/path/to/default-image.png';

const DashBoard = () => {
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

  const keywords = ["Department of Marketing", " tutorialspoint.com", "interrelated", "equivalent", "gastrointestinal", "transfusion programme"];
  const categories = ["Grammar", "SAVE A LIFE", "Cooperative Agreement", "Organization in preference",];
  const categoriesWithSubcategories = {
    "Sql": ["Data type", "Constraints"]
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
  const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("").map((letter) => (
    <a
      key={letter}
      style={{ padding: "5px", cursor: "pointer", fontWeight: "bold" }}
      onClick={() => handleAlphabetClick(letter)}  // Pass the clicked letter
    >
      {letter}
    </a>
));
  const removeFilter = (filterToRemove) => {
    setSearchFilters((prevFilters) =>
      prevFilters.filter((filter) => filter !== filterToRemove)
    );
    if (searchFilters.length === 1) {
      setFilteredData([]); // Reset the filtered data when all filters are removed
    }
  };
  const handleWordClick = (word) => {
    navigate(`/search/${encodeURIComponent(word)}`); // Navigate to the new component
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
  const handleReadMoreClick = (articleId) => {
    setSelectedArticleId(articleId);
  };
  
  const handleSearchall = () => {
    if (!keyword) return;
  
    if (selectedCategoryby === 'All') {
      handleSearch(keyword);debugger
    } else if (selectedCategoryby === 'byCategory') {
      handleTagSearch(keyword);
    }
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
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'white', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img
            src={require('./image/tmsLogo-removebg-preview.png')}
            className="logo"
            alt=""
            style={{ width: '80px', height: '80px' }}
          />
          <Menu mode="horizontal" theme="light" style={{ lineHeight: '64px' }}>
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
        <Sider collapsible>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/dashboard')}>
              Dashboard
            </Menu.Item>
            <Menu.SubMenu key="sub1" icon={<FileOutlined />} title="Categories">
              <Menu.Item key="1-1" icon={<FileTextOutlined />} onClick={() => navigate('/categories/grammar')}>
                Grammar
              </Menu.Item>
              <Menu.Item key="1-2" icon={<FileTextOutlined />} onClick={() => navigate('/categories/save-a-life')}>
                SAVE A LIFE
              </Menu.Item>
              <Menu.Item key="1-3" icon={<FileTextOutlined />} onClick={() => navigate('/categories/cooperative-agreement')}>
                Cooperative Agreement
              </Menu.Item>
              <Menu.Item key="1-4" icon={<FileTextOutlined />} onClick={() => navigate('/categories/organization-in-preference')}>
                Organization in Preference
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate('/users')}>
              Users
            </Menu.Item>
            <Menu.SubMenu key="sub2" icon={<TagOutlined />} title="Tags">
              <Menu.Item key="2-1" icon={<FileTextOutlined />} onClick={() => navigate('/tags/circumstantial-programme')}>
                Circumstantial Programme
              </Menu.Item>
              <Menu.Item key="2-2" icon={<FileTextOutlined />} onClick={() => navigate('/tags/module-excu-donate')}>
                Module Excu Donate
              </Menu.Item>
              <Menu.Item key="2-3" icon={<FileTextOutlined />} onClick={() => navigate('/tags/tips-voluntary-gastrointestinal')}>
                Tips Voluntary Gastrointestinal
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub3" icon={<QuestionCircleOutlined />} title="Questions">
              <Menu.Item key="3-1" onClick={() => navigate('/questions/impedance')}>
                What is Impedance?
              </Menu.Item>
              <Menu.Item key="3-2" onClick={() => navigate('/questions/nosql')}>
                What is NoSQL (Not Only SQL database)?
              </Menu.Item>
              <Menu.Item key="3-3" onClick={() => navigate('/questions/ifs-ab')}>
                What is IFS AB?
              </Menu.Item>
              <Menu.Item key="3-4" onClick={() => navigate('/questions/data-fabric')}>
                What is a Data Fabric?
              </Menu.Item>
              <Menu.Item key="3-5" onClick={() => navigate('/questions/software-license')}>
                What is a Software License?
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub4" icon={<SearchOutlined />} title="Advance Search">
              <Menu.Item key="4-1" onClick={() => navigate('/advanced-search/article-name')}>
                Article Name
              </Menu.Item>
              <Menu.Item key="4-2" onClick={() => navigate('/advanced-search/author-name')}>
                Author Name
              </Menu.Item>
              <Menu.Item key="4-3" onClick={() => navigate('/advanced-search/date')}>
                Date
              </Menu.Item>
              <Menu.Item key="4-4" onClick={() => navigate('/advanced-search/tags')}>
                Tags
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360, }}>
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
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashBoard;
