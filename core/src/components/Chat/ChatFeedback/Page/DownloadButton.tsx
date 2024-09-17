import Button from '@mui/material/Button';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { ChatbotComment } from '../../../../types';

type DownloadButtonProps = {
  items: ChatbotComment[];
};

function flattenObject(
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (
      typeof obj[k] === 'object' &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

function formatDate(date: Date): string {
  const pad = (num: number): string => num.toString().padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}_` +
    `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(
      date.getSeconds()
    )}`
  );
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = JSON.stringify(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('\n') ||
    stringValue.includes('"')
  ) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
}

function convertToCSV(items: DownloadButtonProps['items']): string {
  if (items.length === 0) {
    return 'No feedback';
  }

  const headers = Object.keys(flattenObject(items[0]));
  const rows = items.map((item) => Object.entries(flattenObject(item)));

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
}

export function DownloadButton({ items }: DownloadButtonProps) {
  function handleDownload() {
    const filename = `Chatbot Feedback ${formatDate(new Date())}.csv`;
    const csvContent = convertToCSV(items);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <Button
      variant="outlined"
      endIcon={<DownloadIcon />}
      onClick={handleDownload}
    >
      Download {items.length} items
    </Button>
  );
}
