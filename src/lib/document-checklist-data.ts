
'use client';

import { UserRoundCog, Landmark, CreditCard, RectangleEllipsis } from 'lucide-react';
import type { ComponentType } from 'react';

type ChecklistItemContent = {
  type: 'required' | 'optional' | 'options' | 'note';
  text: string;
  choices?: string[];
}

export type ChecklistItem = {
  title: string;
  content: ChecklistItemContent[];
};

export type ChecklistSection = {
  category: string;
  icon: ComponentType<any>;
  items: ChecklistItem[];
};

export const checklistData: ChecklistSection[] = [
  {
    category: 'General Changes',
    icon: UserRoundCog,
    items: [
      {
        title: 'Create Account',
        content: [
          { type: 'required', text: 'Aadhaar Card (mandatory for KYC)' },
          { type: 'required', text: 'PAN Card (mandatory for tax linkage)' },
          { type: 'required', text: 'Passport-size photographs (2-3)' },
          {
            type: 'options',
            text: 'Proof of address (if different from Aadhaar)',
            choices: ['Passport', 'Driving License', 'Voter ID', 'Utility bill'],
          },
          { type: 'required', text: 'Initial deposit (as per bank requirement)' },
        ],
      },
      {
        title: 'Name Change',
        content: [
          { type: 'required', text: 'Application form / written request' },
          {
            type: 'options',
            text: 'Original + copy of proof supporting name change',
            choices: ['Marriage certificate', 'Gazette notification', 'Court order'],
          },
          { type: 'required', text: 'Aadhaar / PAN updated with new name' },
          { type: 'optional', text: 'Passport-size photo (sometimes required)' },
        ],
      },
      {
        title: 'Residential Address Change',
        content: [
          { type: 'required', text: 'Application form / written request' },
          {
            type: 'options',
            text: 'Proof of new address (any one)',
            choices: ['Aadhaar', 'Passport', 'Driving License', 'Voter ID', 'Utility Bill (last 3 months)', 'Rent agreement registered with govt.'],
          },
          { type: 'optional', text: 'Old address proof (sometimes requested for record)' },
        ],
      },
      {
        title: 'Email Address Change',
        content: [
          { type: 'required', text: 'Application form / written request' },
          { type: 'options', text: 'Valid ID proof (for signature verification)', choices: ['PAN', 'Aadhaar', 'Passport', 'Driving License'] },
          { type: 'required', text: 'Existing account details / passbook' },
        ],
      },
      {
        title: 'Mobile Number Update',
        content: [
          { type: 'required', text: 'Request form (signed by account holder)' },
          { type: 'options', text: 'ID proof', choices: ['Aadhaar', 'PAN', 'Passport', 'Driving License'] },
          { type: 'required', text: 'Debit card/passbook/cheque book for account verification' },
          { type: 'note', text: '(Note: Some banks also mandate biometric Aadhaar verification for this.)' },
        ],
      },
      {
        title: 'PAN - Aadhaar Link',
        content: [
          { type: 'required', text: 'PAN Card (original + photocopy)' },
          { type: 'required', text: 'Aadhaar Card (original + photocopy)' },
          { type: 'required', text: 'Account passbook / statement' },
          { type: 'note', text: '(If PAN & Aadhaar are already linked at UIDAI/IT Dept, banks just verify and update.)' },
        ],
      },
      {
        title: 'Date Of Birth Change',
        content: [
          { type: 'required', text: 'Request form + Affidavit (if DOB correction is major)' },
          { type: 'options', text: 'Proof of correct DOB', choices: ['Birth certificate', 'Passport/Aadhaar', '10th mark sheet'] },
          { type: 'required', text: 'Old ID proof (with incorrect DOB, for cross-check)' },
        ],
      },
      {
        title: 'Nominee Change',
        content: [
          { type: 'options', text: 'Nomination form', choices: ['DA1 - for addition/change', 'DA2 - for cancellation'] },
          { type: 'options', text: "Account holder's ID proof", choices: ['Aadhaar', 'PAN'] },
          { type: 'required', text: "Nominee's details (Name, DOB, Address, Relationship, Aadhaar copy if available)" },
          { type: 'optional', text: 'Passport-size photo of nominee (some banks ask, not mandatory everywhere)' },
        ],
      },
    ],
  },
  {
    category: 'Loan Operations',
    icon: Landmark,
    items: [
      {
        title: 'Loan Application Submission',
        content: [
          { type: 'required', text: 'Aadhaar + PAN (mandatory KYC)' },
          { type: 'options', text: 'Address proof', choices: ['Voter ID', 'Passport', 'Driving License', 'Utility Bill'] },
          { type: 'required', text: 'Income proof (Salary slips, Form 16, IT returns, bank statements - usually last 6 months)' },
          { type: 'required', text: 'Passport-size photos' },
          { type: 'optional', text: "Co-applicant/Guarantor's ID + income docs (if applicable)" },
        ],
      },
      {
        title: 'Document Verification & Agreement Signing',
        content: [
          { type: 'required', text: 'Original KYC docs (for verification)' },
          { type: 'required', text: 'Sanction letter (provided by bank)' },
          { type: 'required', text: 'Loan agreement forms (to be signed in branch)' },
        ],
      },
      {
        title: 'Collateral / Security Submission',
        content: [
          { type: 'required', text: 'Home Loan/Mortgage: Property papers (Sale deed, Agreement to sell, Approved building plan, Tax receipts)' },
          { type: 'required', text: 'Gold Loan: Physical gold items + ID proof' },
          { type: 'required', text: 'FD-backed Loan: Original FD receipt' },
          { type: 'required', text: 'Insurance-backed Loan: Policy bond' },
        ],
      },
      {
        title: 'Loan Disbursal Formalities',
        content: [
          { type: 'required', text: 'Signed disbursal request form' },
          { type: 'options', text: 'Own contribution proof', choices: ['RTGS/NEFT receipt', 'cheque'] },
          { type: 'required', text: 'Bank account details for credit (passbook/cheque leaf)' },
        ],
      },
      {
        title: 'EMI Mandate Setup / Change',
        content: [
          { type: 'required', text: 'NACH/ECS mandate form (signed)' },
          { type: 'required', text: 'Cancelled cheque of new account' },
          { type: 'required', text: 'ID proof (for signature verification)' },
          { type: 'required', text: 'Loan account number & request form' },
        ],
      },
      {
        title: 'Prepayment/Part-Payment',
        content: [
          { type: 'required', text: 'PAN card (for large payment)' },
          { type: 'options', text: 'Payment method', choices: ['Cheque/DD', 'bank transfer receipt'] },
        ],
      },
      {
        title: 'Loan Restructuring / Moratorium',
        content: [
          { type: 'required', text: 'Request application' },
          { type: 'required', text: 'ID proof + Loan account statement' },
          { type: 'required', text: 'Income proof (latest salary slips, bank statements showing reduced income)' },
        ],
      },
      {
        title: 'Loan Closure & NOC Collection',
        content: [
          { type: 'required', text: 'Loan account closure request form' },
          { type: 'required', text: 'ID proof' },
          { type: 'required', text: 'Final payment receipt / settlement letter' },
        ],
      },
      {
        title: 'Return of Original Documents',
        content: [
          { type: 'required', text: 'Loan closure letter (from bank)' },
          { type: 'required', text: 'ID proof of borrower' },
          { type: 'optional', text: 'Authorization letter (if co-applicant/representative is collecting docs)' },
        ],
      },
      {
        title: 'Adding / Removing a Co-applicant or Guarantor',
        content: [
          { type: 'required', text: 'Request form (signed by all parties)' },
          { type: 'required', text: 'KYC of new co-applicant/guarantor (Aadhaar, PAN, Address proof)' },
          { type: 'required', text: 'Income proof of new co-applicant (salary slips / IT returns)' },
          { type: 'required', text: 'Consent letter from existing borrower(s)' },
          { type: 'optional', text: 'Loan account statement (for reference)' },
        ],
      },
      {
        title: 'Changing Loan Repayment Mode',
        content: [
          { type: 'required', text: 'Request application form' },
          { type: 'required', text: 'Cancelled cheque (new bank account)' },
          { type: 'required', text: 'ID proof (signature verification)' },
          { type: 'required', text: 'Previous repayment mandate (to cancel/replace)' },
        ],
      },
    ],
  },
  {
    category: 'Card Operations (Debit & Credit)',
    icon: CreditCard,
    items: [
      {
        title: 'New Card Issuance',
        content: [
          { type: 'options', text: 'Application Form', choices: ['Account opening form', 'Credit card application form'] },
          { type: 'required', text: 'KYC (Aadhaar + PAN + Address proof)' },
          { type: 'required', text: 'Income proof (for credit card - salary slips, IT return, bank statement)' },
          { type: 'required', text: 'Passport-size photo' },
        ],
      },
      {
        title: 'PIN Generation / Reset',
        content: [
          { type: 'required', text: 'Card (Debit/Credit)' },
          { type: 'options', text: 'ID proof', choices: ['Aadhaar', 'PAN', 'Driving License', 'Passport'] },
          { type: 'required', text: 'Account details / Passbook' },
        ],
      },
      {
        title: 'Card Replacement',
        content: [
          { type: 'required', text: 'Request form (application for replacement)' },
          { type: 'optional', text: 'FIR copy (only if required for stolen card by some banks)' },
          { type: 'required', text: 'ID proof' },
          { type: 'optional', text: 'Old/damaged card (if available)' },
        ],
      },
      {
        title: 'Credit Limit Enhancement / Reduction',
        content: [
          { type: 'required', text: 'Application form' },
          { type: 'required', text: 'Latest income proof (salary slips/ITR/bank statement)' },
          { type: 'required', text: 'Existing card details' },
          { type: 'required', text: 'ID proof' },
        ],
      },
      {
        title: 'International Usage Activation',
        content: [
          { type: 'required', text: 'Request application form' },
          { type: 'required', text: 'PAN card (mandatory for forex use)' },
          { type: 'optional', text: 'Travel proof (air ticket, visa) - sometimes required' },
          { type: 'required', text: 'ID proof' },
        ],
      },
      {
        title: 'Linking/Delinking Card to Account',
        content: [
          { type: 'required', text: 'Request form' },
          { type: 'required', text: 'KYC of additional holder (Aadhaar, PAN)' },
          { type: 'optional', text: 'Relationship proof (for add-on credit cards: family ID, marriage certificate, etc.)' },
          { type: 'required', text: 'Signature verification' },
        ],
      },
      {
        title: 'Card Closure / Cancellation',
        content: [
          { type: 'required', text: 'Request form signed by cardholder' },
          { type: 'required', text: 'ID proof' },
          { type: 'required', text: 'Pending dues clearance (credit card) - payment receipt' },
          { type: 'required', text: 'Original card submission (cut/destroyed in branch)' },
        ],
      },
    ],
  },
  {
    category: 'Cheque Operations',
    icon: RectangleEllipsis,
    items: [
      {
        title: 'New Cheque Book Request',
        content: [
          { type: 'options', text: 'Request Method', choices: ['Request form', 'Requisition slip (from passbook or bank form)'] },
          { type: 'options', text: 'Account ownership proof', choices: ['Account passbook', 'Debit card'] },
          { type: 'options', text: 'ID proof', choices: ['PAN', 'Aadhaar', 'Driving License', 'Passport'] },
        ],
      },
      {
        title: 'Urgent / Instant Cheque Book Issue',
        content: [
          { type: 'required', text: 'Request application' },
          { type: 'options', text: 'Account details', choices: ['passbook', 'cheque leaf'] },
          { type: 'required', text: 'ID proof' },
          { type: 'optional', text: 'Authorization letter (if collected by someone else)' },
        ],
      },
      {
        title: 'Replacement of Lost / Stolen Cheque Book',
        content: [
          { type: 'required', text: 'Application form / written request' },
          { type: 'optional', text: 'FIR copy (sometimes required, depending on bank)' },
          { type: 'required', text: 'ID proof' },
          { type: 'optional', text: 'Account details (passbook/old cheque stub if available)' },
        ],
      },
      {
        title: 'Stop Payment of Cheque(s)',
        content: [
          { type: 'required', text: 'Stop payment request form' },
          { type: 'required', text: 'Cheque details (cheque number, amount, payee name, date)' },
          { type: 'required', text: 'ID proof' },
          { type: 'required', text: 'Account details' },
        ],
      },
      {
        title: 'Change in Cheque Book Delivery Mode',
        content: [
          { type: 'required', text: 'Request form' },
          { type: 'required', text: 'ID proof' },
          { type: 'required', text: 'Account passbook / statement for verification' },
        ],
      },
      {
        title: 'Correction of Wrongly Issued Cheque Book',
        content: [
          { type: 'required', text: 'Incorrect cheque book' },
          { type: 'required', text: 'Request form' },
          { type: 'required', text: 'ID proof' },
        ],
      },
    ],
  },
];
