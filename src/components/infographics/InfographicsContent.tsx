'use client';

import React from 'react';
import Layout from '@/components/Layout';
import InfographicsGenerator from '@/components/infographics/InfographicsGenerator';

const InfographicsContent: React.FC = () => {
  return (
    <Layout>
      <InfographicsGenerator />
    </Layout>
  );
};

export default InfographicsContent;