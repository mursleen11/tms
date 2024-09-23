import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Spin, Card, Input, Button } from "antd";
import moment from "moment";

const { Title } = Typography;
const { Search } = Input;

const ArticleDetail = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayContent, setDisplayContent] = useState('');

  const keywords = ["Department of Marketing", "Energiministeriet", "circumstantial", "equivalent", "gastrointestinal", "transfusion programme"];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://localhost:44343/api/Admin/List/${id}`);
        setArticle(response.data);
        setDisplayContent(response.data.Content);
      } catch (err) {
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) {
      const renderResultWithLinks = (text) => {
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

      const filterContent = (content, searchTerm) => {
        if (!searchTerm.trim()) return content;
        const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (index === -1) return '';
        return content.substring(index);
      };

      const filteredContent = filterContent(article.Content, searchTerm);
      const contentWithLinks = renderResultWithLinks(filteredContent);

      setDisplayContent(contentWithLinks);
    }
  }, [searchTerm, article]);

  const handleWordClick = (word) => {
    // Implement the logic for the API call or navigation here
    // For example, navigate to a new page or make an API call
    console.log(`Clicked keyword: ${word}`);
    // Example: navigate to a new page
    navigate(`/search/${encodeURIComponent(word)}`);
  };

  if (loading) return <Spin />;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Card title="Article Details" style={{ width: '100%', maxWidth: 800, margin: '0 auto', padding: '20px', overflow: 'hidden', textAlign: 'left' }}>
      <Button type="primary" onClick={() => window.history.back()} style={{marginLeft: '10px', float: 'right'}}>back</Button>
      {article && (
        <div style={{ wordWrap: 'break-word' }}>
          <Link to={`/article/${article.ID}`}>
            <Title level={3} style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
              {article.ArticalName}
            </Title>
          </Link>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            <strong>Author:</strong> {article.Author}
          </p>
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>
            <strong>Date:</strong> {moment(article.Date).format('MMMM Do YYYY')}
          </p>
          <Input
            style={{ width: '30%' }}
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <hr />
          <div style={{ fontSize: '16px', lineHeight: '1.6', overflow: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {displayContent}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ArticleDetail;
