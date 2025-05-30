from datetime import datetime, timedelta


"""
Extracts a datetime object and a date object from a given input string.

Args:
    input_datetime (str): A string representing the datetime in the format 'HH:MM:SS - DD/MM/YYYY'.

Returns:
    tuple: A tuple containing:
        - res_dt (datetime): A datetime object representing the full datetime.
        - res_d (date): A date object representing only the date part.

Raises:
    ValueError: If the input string does not match the expected format.

Example:
    >>> extract_datetime('11:40:10 - 22/05/2025')
    (datetime.datetime(2025, 5, 22, 11, 40, 10), datetime.date(2025, 5, 22))
"""
def extract_datetime(input_datetime):
    if not input_datetime:
        print("Datetime is required !")
        return None, None

    try:
        res_dt = datetime.strptime(input_datetime, "%H:%M:%S - %d/%m/%Y")
        res_d = res_dt.date()
    except ValueError:
        print("Invalid input format. Expected format: 'HH:MM:SS - DD/MM/YYYY")
        return None, None

    return res_dt, res_d

# print(extract_datetime('11:40:10 - 22/05/2025'))