export const taxMockData = {
    taxConfiguration: [
      {
        id: 1,
        tax_code_id: 'TAX001',
        tax_code_name: 'UK VAT Standard Rate',
        tax_type: 'VAT',
        tax_rate: 20.00,
        tax_authority: 'HM Revenue & Customs',
        jurisdiction: 'FEDERAL',
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        tax_base: 'EXCLUSIVE',
        compound_tax_flag: false,
        recoverable_flag: true,
        status: 'ACTIVE'
      },
      {
        id: 2,
        tax_code_id: 'TAX002',
        tax_code_name: 'US Sales Tax - California',
        tax_type: 'SALES_TAX',
        tax_rate: 8.25,
        tax_authority: 'California Department of Tax',
        jurisdiction: 'STATE',
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        tax_base: 'EXCLUSIVE',
        compound_tax_flag: false,
        recoverable_flag: false,
        status: 'ACTIVE'
      },
      {
        id: 3,
        tax_code_id: 'TAX003',
        tax_code_name: 'EU VAT Reduced Rate',
        tax_type: 'VAT',
        tax_rate: 10.00,
        tax_authority: 'European Commission',
        jurisdiction: 'FEDERAL',
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        tax_base: 'EXCLUSIVE',
        compound_tax_flag: false,
        recoverable_flag: true,
        status: 'ACTIVE'
      },
      {
        id: 4,
        tax_code_id: 'TAX004',
        tax_code_name: 'Canada GST',
        tax_type: 'GST',
        tax_rate: 5.00,
        tax_authority: 'Canada Revenue Agency',
        jurisdiction: 'FEDERAL',
        effective_start_date: '2024-01-01',
        effective_end_date: '2024-12-31',
        tax_base: 'EXCLUSIVE',
        compound_tax_flag: false,
        recoverable_flag: true,
        status: 'ACTIVE'
      }
    ],
    
    taxAuthorities: [
      {
        id: 1,
        authority_id: 'AUTH001',
        authority_name: 'HM Revenue & Customs',
        jurisdiction_type: 'FEDERAL',
        country: 'United Kingdom',
        tax_registration_number: 'GB123456789',
        contact_email: 'contact@hmrc.gov.uk',
        contact_phone: '+44 300 200 3300',
        filing_frequency: 'QUARTERLY',
        payment_terms: '30_DAYS',
        electronic_filing_required: true,
        status: 'ACTIVE'
      },
      {
        id: 2,
        authority_id: 'AUTH002',
        authority_name: 'Internal Revenue Service',
        jurisdiction_type: 'FEDERAL',
        country: 'United States',
        tax_registration_number: 'US987654321',
        contact_email: 'contact@irs.gov',
        contact_phone: '+1 800 829 1040',
        filing_frequency: 'QUARTERLY',
        payment_terms: '15_DAYS',
        electronic_filing_required: true,
        status: 'ACTIVE'
      },
      {
        id: 3,
        authority_id: 'AUTH003',
        authority_name: 'California Department of Tax',
        jurisdiction_type: 'STATE',
        country: 'United States',
        tax_registration_number: 'CA555444333',
        contact_email: 'contact@cdtfa.ca.gov',
        contact_phone: '+1 800 400 7115',
        filing_frequency: 'MONTHLY',
        payment_terms: '30_DAYS',
        electronic_filing_required: true,
        status: 'ACTIVE'
      },
      {
        id: 4,
        authority_id: 'AUTH004',
        authority_name: 'Canada Revenue Agency',
        jurisdiction_type: 'FEDERAL',
        country: 'Canada',
        tax_registration_number: 'CA111222333',
        contact_email: 'contact@cra-arc.gc.ca',
        contact_phone: '+1 800 959 8281',
        filing_frequency: 'QUARTERLY',
        payment_terms: '30_DAYS',
        electronic_filing_required: true,
        status: 'ACTIVE'
      }
    ],
    
    taxReturns: [
      {
        id: 1,
        return_id: 'VAT001',
        tax_authority: 'HM Revenue & Customs',
        return_type: 'VAT',
        filing_period_start: '2024-07-01',
        filing_period_end: '2024-09-30',
        due_date: '2024-11-07',
        filing_status: 'FILED',
        total_tax_due: 15000.00,
        total_tax_paid: 15000.00,
        balance_due_refund: 0.00,
        filing_method: 'ELECTRONIC',
        confirmation_number: 'VAT2024Q3001'
      },
      {
        id: 2,
        return_id: 'GST001',
        tax_authority: 'Canada Revenue Agency',
        return_type: 'GST',
        filing_period_start: '2024-07-01',
        filing_period_end: '2024-09-30',
        due_date: '2024-10-31',
        filing_status: 'DRAFT',
        total_tax_due: 8500.00,
        total_tax_paid: 7000.00,
        balance_due_refund: 1500.00,
        filing_method: 'ELECTRONIC',
        confirmation_number: null
      },
      {
        id: 3,
        return_id: 'ST001',
        tax_authority: 'California Department of Tax',
        return_type: 'SALES_TAX',
        filing_period_start: '2024-09-01',
        filing_period_end: '2024-09-30',
        due_date: '2024-10-30',
        filing_status: 'ACCEPTED',
        total_tax_due: 12000.00,
        total_tax_paid: 12000.00,
        balance_due_refund: 0.00,
        filing_method: 'ONLINE_PORTAL',
        confirmation_number: 'ST2024SEP001'
      }
    ],
    
    taxCalculations: [
      {
        id: 1,
        calculation_id: 'CALC001',
        transaction_type: 'SALE',
        transaction_date: '2024-08-15',
        taxable_amount: 1000.00,
        tax_code_applied: 'TAX001',
        calculated_tax_amount: 200.00,
        tax_jurisdiction: 'UK',
        exemption_code: null,
        override_flag: false,
        override_reason: null,
        calculation_method: 'STANDARD',
        reverse_charge_flag: false
      },
      {
        id: 2,
        calculation_id: 'CALC002',
        transaction_type: 'PURCHASE',
        transaction_date: '2024-08-16',
        taxable_amount: 500.00,
        tax_code_applied: 'TAX002',
        calculated_tax_amount: 41.25,
        tax_jurisdiction: 'CA-US',
        exemption_code: null,
        override_flag: false,
        override_reason: null,
        calculation_method: 'STANDARD',
        reverse_charge_flag: false
      },
      {
        id: 3,
        calculation_id: 'CALC003',
        transaction_type: 'SALE',
        transaction_date: '2024-08-17',
        taxable_amount: 2000.00,
        tax_code_applied: 'TAX004',
        calculated_tax_amount: 100.00,
        tax_jurisdiction: 'CA',
        exemption_code: null,
        override_flag: false,
        override_reason: null,
        calculation_method: 'STANDARD',
        reverse_charge_flag: false
      }
    ],
    
    taxAuditTrail: [
      {
        id: 1,
        audit_trail_id: 'AUDIT001',
        transaction_id: 'TXN001',
        original_tax_amount: 200.00,
        adjusted_tax_amount: 180.00,
        adjustment_reason: 'Customer discount applied',
        adjusted_by: 'Jane Smith',
        adjustment_date: '2024-08-15',
        approval_status: 'APPROVED',
        supporting_documentation: 'DOC001.pdf',
        authority_reference: null,
        impact_assessment: 'Minimal impact on quarterly filing'
      },
      {
        id: 2,
        audit_trail_id: 'AUDIT002',
        transaction_id: 'TXN002',
        original_tax_amount: 100.00,
        adjusted_tax_amount: 120.00,
        adjustment_reason: 'Tax rate correction',
        adjusted_by: 'John Doe',
        adjustment_date: '2024-08-16',
        approval_status: 'PENDING',
        supporting_documentation: 'DOC002.pdf',
        authority_reference: 'REF123',
        impact_assessment: 'Requires amended return filing'
      }
    ],
    
    taxExemptions: [
      {
        id: 1,
        exemption_id: 'EX001',
        customer_vendor_id: 'CUST001',
        exemption_type: 'NON_PROFIT',
        exemption_certificate_number: 'NP123456789',
        issuing_authority: 'State Revenue Department',
        valid_from_date: '2024-01-01',
        valid_to_date: '2024-12-31',
        applicable_tax_types: ['SALES_TAX', 'USE_TAX'],
        exemption_percentage: 100.00,
        geographic_scope: 'California, USA',
        status: 'VALID'
      },
      {
        id: 2,
        exemption_id: 'EX002',
        customer_vendor_id: 'CUST002',
        exemption_type: 'DIPLOMATIC',
        exemption_certificate_number: 'DIP987654321',
        issuing_authority: 'State Department',
        valid_from_date: '2024-01-01',
        valid_to_date: '2026-12-31',
        applicable_tax_types: ['VAT', 'SALES_TAX'],
        exemption_percentage: 100.00,
        geographic_scope: 'United States',
        status: 'VALID'
      },
      {
        id: 3,
        exemption_id: 'EX003',
        customer_vendor_id: 'CUST003',
        exemption_type: 'RESALE',
        exemption_certificate_number: 'RS555444333',
        issuing_authority: 'Department of Revenue',
        valid_from_date: '2024-01-01',
        valid_to_date: '2025-12-31',
        applicable_tax_types: ['SALES_TAX'],
        exemption_percentage: 100.00,
        geographic_scope: 'New York, USA',
        status: 'VALID'
      }
    ],
    
    internationalTaxCompliance: [
      {
        id: 1,
        compliance_id: 'ITC001',
        country_jurisdiction: 'Germany',
        tax_treaty_information: 'US-Germany Tax Treaty',
        transfer_pricing_rules: 'OECD Guidelines',
        withholding_tax_rates: 5.00,
        documentation_requirements: 'Country-by-Country Reporting',
        filing_deadlines: '2024-12-31',
        local_representative_details: 'Berlin Tax Services GmbH',
        compliance_status: 'COMPLIANT',
        risk_assessment_score: 'LOW'
      },
      {
        id: 2,
        compliance_id: 'ITC002',
        country_jurisdiction: 'Singapore',
        tax_treaty_information: 'US-Singapore Tax Treaty',
        transfer_pricing_rules: 'OECD Guidelines',
        withholding_tax_rates: 0.00,
        documentation_requirements: 'Transfer Pricing Documentation',
        filing_deadlines: '2024-11-30',
        local_representative_details: 'Singapore Tax Partners Pte Ltd',
        compliance_status: 'PENDING',
        risk_assessment_score: 'MEDIUM'
      },
      {
        id: 3,
        compliance_id: 'ITC003',
        country_jurisdiction: 'Brazil',
        tax_treaty_information: 'No Treaty',
        transfer_pricing_rules: 'Local Rules',
        withholding_tax_rates: 15.00,
        documentation_requirements: 'ECF and Local File',
        filing_deadlines: '2024-12-31',
        local_representative_details: 'Sao Paulo Tax Consultants',
        compliance_status: 'NON_COMPLIANT',
        risk_assessment_score: 'HIGH'
      }
    ],
    
    taxPayments: [
      {
        id: 1,
        payment_id: 'PAY001',
        tax_authority: 'HM Revenue & Customs',
        payment_type: 'FINAL',
        payment_date: '2024-08-15',
        payment_method: 'ELECTRONIC',
        payment_amount: 15000.00,
        reference_number: 'TXN123456789',
        bank_account_used: 'Business Checking - ***1234',
        payment_status: 'COMPLETED',
        confirmation_receipt: 'RCP001.pdf'
      },
      {
        id: 2,
        payment_id: 'PAY002',
        tax_authority: 'Internal Revenue Service',
        payment_type: 'ESTIMATED',
        payment_date: '2024-09-15',
        payment_method: 'BANK_TRANSFER',
        payment_amount: 25000.00,
        reference_number: 'EST2024Q3001',
        bank_account_used: 'Business Checking - ***5678',
        payment_status: 'PROCESSED',
        confirmation_receipt: 'RCP002.pdf'
      },
      {
        id: 3,
        payment_id: 'PAY003',
        tax_authority: 'California Department of Tax',
        payment_type: 'PENALTY',
        payment_date: '2024-08-20',
        payment_method: 'ONLINE_PORTAL',
        payment_amount: 500.00,
        reference_number: 'PEN2024001',
        bank_account_used: 'Business Checking - ***1234',
        payment_status: 'COMPLETED',
        confirmation_receipt: 'RCP003.pdf'
      }
    ],
    
    taxReporting: [
      {
        id: 1,
        report_period: '2024-Q3',
        tax_collected: 45000.00,
        tax_paid: 15000.00,
        net_tax_position: 30000.00,
        tax_by_jurisdiction: {
          'UK': 15000.00,
          'US-CA': 12000.00,
          'US-NY': 8000.00,
          'CA': 10000.00
        },
        tax_by_category: {
          'VAT': 15000.00,
          'SALES_TAX': 20000.00,
          'GST': 10000.00
        },
        compliance_status: 'COMPLIANT',
        outstanding_returns: 1,
        penalty_assessments: 500.00,
        payment_status: 'CURRENT'
      },
      {
        id: 2,
        report_period: '2024-Q2',
        tax_collected: 38000.00,
        tax_paid: 12000.00,
        net_tax_position: 26000.00,
        tax_by_jurisdiction: {
          'UK': 12000.00,
          'US-CA': 10000.00,
          'US-NY': 6000.00,
          'CA': 10000.00
        },
        tax_by_category: {
          'VAT': 12000.00,
          'SALES_TAX': 16000.00,
          'GST': 10000.00
        },
        compliance_status: 'COMPLIANT',
        outstanding_returns: 0,
        penalty_assessments: 0.00,
        payment_status: 'CURRENT'
      }
    ],
    
    taxDashboardMetrics: {
      totalTaxCollected: 83000.00,
      totalTaxPaid: 27000.00,
      netTaxPosition: 56000.00,
      activeExemptions: 3,
      pendingReturns: 1,
      overduePayments: 0,
      complianceScore: 95,
      riskAssessment: 'LOW',
      nextFilingDue: '2024-10-31',
      estimatedQuarterlyLiability: 18000.00
    }
  };